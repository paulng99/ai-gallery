import os
import httpx
import faiss
import numpy as np
import pickle
from typing import List, Tuple, Optional
from uuid import uuid4

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OPENAI_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

# FAISS Index Path
INDEX_PATH = os.path.join(os.path.dirname(__file__), "../../data/faiss.index")
METADATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/faiss_metadata.pkl")

class AIService:
    def __init__(self):
        self.dimension = 1024  # Default dimension for compatible embeddings
        self.index = self._load_index()
        self.metadata = self._load_metadata()
        self.http_client = httpx.AsyncClient(timeout=60.0)

    def _load_index(self):
        if os.path.exists(INDEX_PATH):
            return faiss.read_index(INDEX_PATH)
        return faiss.IndexFlatL2(self.dimension)

    def _load_metadata(self):
        if os.path.exists(METADATA_PATH):
            with open(METADATA_PATH, "rb") as f:
                return pickle.load(f)
        return []

    def _save_index(self):
        faiss.write_index(self.index, INDEX_PATH)
        with open(METADATA_PATH, "wb") as f:
            pickle.dump(self.metadata, f)

    def _get_openrouter_headers(self):
        return {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Gallery",
            "Content-Type": "application/json",
        }

    async def _call_openrouter(self, messages: List[dict], model: str = "qwen/qwen-2-vl-7b-instruct") -> str:
        """Call OpenRouter API and return the response content."""
        if not OPENROUTER_API_KEY:
            raise ValueError("OPENAI_API_KEY (OpenRouter) not set")
        
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 500,
        }
        
        response = await self.http_client.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=self._get_openrouter_headers(),
            json=payload
        )
        response.raise_for_status()
        
        data = response.json()
        return data["choices"][0]["message"]["content"]

    async def generate_caption(self, image_url: str) -> Tuple[str, List[str]]:
        """
        Generates a description and hashtags for an image using a VLM via OpenRouter.
        Returns: (description, hashtags_list)
        """
        try:
            # Using Qwen VL model via OpenRouter for image analysis
            content = await self._call_openrouter([
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": """分析這張圖片。請用繁體中文提供：
1. 簡短描述（2-3句）
2. 5-10個英文標籤（逗號分隔）

範例格式：
描述：一位學生在操場跑步
標籤：student, running, playground, school, sports"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        },
                    ],
                }
            ])
            
            # Parse the response - support multiple formats
            description = ""
            hashtags = []
            
            # Try different patterns
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                
                # Check for various label patterns
                if any(keyword in line.lower() for keyword in ['標籤', 'tags', 'hashtag', 'label']):
                    # Extract everything after the colon or keyword
                    if ':' in line:
                        tags_raw = line.split(':')[-1].strip()
                    else:
                        # Find position of tags keyword and get text after it
                        idx = max([line.lower().find(kw) for kw in ['標籤', 'tags', 'hashtag'] if line.lower().find(kw) >= 0])
                        if idx >= 0:
                            tags_raw = line[idx + max(len('標籤'), len('tags'), len('hashtag')):].strip(': ').strip()
                        else:
                            tags_raw = line
                    
                    # Clean up and split
                    tags_raw = tags_raw.replace('#', '').strip()
                    hashtags = [t.strip() for t in tags_raw.split(',') if t.strip() and len(t.strip()) < 30]
                
                # Check for description
                elif any(keyword in line.lower() for keyword in ['描述', 'description', '說明']):
                    if ':' in line:
                        desc = line.split(':')[-1].strip()
                        if desc and len(desc) > 5:
                            description = desc

            # If still no description, use first substantial line
            if not description:
                for line in lines:
                    line = line.strip()
                    if line and len(line) > 10 and not any(kw in line.lower() for kw in ['標籤', 'tags', 'hashtag']):
                        description = line
                        break
            
            # Clean up description
            description = description.strip('。').strip()
            if not description:
                description = content[:100].strip()
                
            return description, hashtags[:10]  # Limit to 10 tags
            
        except Exception as e:
            print(f"Error generating caption: {e}")
            return "分析失敗", []

    async def generate_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate text embedding using OpenRouter.
        Note: OpenRouter may not support embeddings endpoint directly.
        Using a workaround: generate embedding via a text model.
        """
        try:
            # Try to use a model that supports embeddings
            # If OpenRouter doesn't support embeddings, we'll use a simple hash-based approach
            # as fallback for demo purposes
            
            # Option 1: Use OpenRouter completions to get embedding-like representation
            # For production, consider using a dedicated embedding service like:
            # - HuggingFace Inference API
            # - Cohere
            # - OpenAI directly (if you have an API key)
            
            # For now, use text-embedding-3-small if supported via OpenRouter
            try:
                response = await self.http_client.post(
                    f"{OPENROUTER_BASE_URL}/embeddings",
                    headers=self._get_openrouter_headers(),
                    json={
                        "model": "text-embedding-3-small",
                        "input": text
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["data"][0]["embedding"]
            except Exception:
                pass
            
            # Fallback: Simple text hashing for demo (NOT for production)
            # This creates a deterministic vector from text
            import hashlib
            hash_obj = hashlib.sha256(text.encode())
            hash_bytes = hash_obj.digest()
            
            # Convert to fixed-size float array
            vector = []
            for i in range(self.dimension):
                byte_val = hash_bytes[i % len(hash_bytes)] if i < len(hash_bytes) * 4 else 0
                vector.append(float(byte_val) / 255.0)
            
            return vector
            
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * self.dimension

    async def process_photo(self, photo_id: str, image_url: str):
        """
        Full pipeline: Caption -> Embedding -> FAISS
        """
        print(f"Starting analysis for {photo_id}...")
        
        # Generate caption and hashtags
        description, hashtags = await self.generate_caption(image_url)
        
        # Generate embedding
        full_text = f"{description} {' '.join(hashtags)}"
        vector = await self.generate_embedding(full_text)
        
        # FAISS update (Sync)
        if vector and len(vector) == self.dimension:
            self.index.add(np.array([vector], dtype=np.float32))
            self.metadata.append(photo_id)
            self._save_index()
            
        return description, hashtags

    async def search(self, query: str, limit: int = 10) -> List[str]:
        """
        Semantic search. Returns list of photo_ids.
        """
        try:
            vector = await self.generate_embedding(query)
            if not vector or len(vector) != self.dimension:
                return []
            
            # FAISS search
            distances, indices = self.index.search(np.array([vector], dtype=np.float32), limit)
            
            results = []
            for idx in indices[0]:
                if idx != -1 and idx < len(self.metadata):
                    results.append(self.metadata[idx])
            
            return results
        except Exception as e:
            print(f"Search error: {e}")
            return []

    async def close(self):
        await self.http_client.aclose()

ai_service = AIService()
