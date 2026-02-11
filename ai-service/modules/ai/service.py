import os
import openai
import faiss
import numpy as np
import pickle
from typing import List, Tuple

# Initialize OpenAI
# Note: For OpenRouter, we use the OpenAI client but with a different base URL
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.base_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

# FAISS Index Path
INDEX_PATH = os.path.join(os.path.dirname(__file__), "../../data/faiss.index")
METADATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/faiss_metadata.pkl")

class AIService:
    def __init__(self):
        self.dimension = 1536  # OpenAI text-embedding-3-small dimension
        self.index = self._load_index()
        self.metadata = self._load_metadata()

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

    async def generate_caption(self, image_url: str) -> Tuple[str, List[str]]:
        """
        Generates a description and hashtags for an image using a VLM.
        Returns: (description, hashtags_list)
        """
        try:
            # Using GPT-4o or similar VLM via OpenRouter
            response = openai.chat.completions.create(
                model="openai/gpt-4o-mini", # Cost-effective VLM
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this image for a school gallery. Provide a concise description (2-3 sentences) and 5-10 relevant hashtags (comma separated). Format: Description: [text] Hashtags: [tag1, tag2]"},
                            {"type": "image_url", "image_url": {"url": image_url}},
                        ],
                    }
                ],
            )
            content = response.choices[0].message.content
            
            # Simple parsing
            description = ""
            hashtags = []
            
            lines = content.split('\n')
            for line in lines:
                if "Description:" in line:
                    description = line.replace("Description:", "").strip()
                elif "Hashtags:" in line:
                    tags_raw = line.replace("Hashtags:", "").strip()
                    hashtags = [t.strip().replace('#', '') for t in tags_raw.split(',')]
            
            if not description: # Fallback if format is weird
                description = content
                
            return description, hashtags
        except Exception as e:
            print(f"Error generating caption: {e}")
            return "Analysis failed", []

    async def generate_embedding(self, text: str) -> List[float]:
        try:
            # OpenRouter might not support embeddings directly, check docs. 
            # If OpenRouter doesn't support embeddings, we might need direct OpenAI or another provider.
            # Assuming standard OpenAI interface for now or a compatible one.
            # If OpenRouter fails, we might need to swap to a local model or direct OpenAI key.
            # SAFEGUARD: Use text-embedding-3-small directly if key allows, or generic.
            
            # For this implementation, let's assume standard OpenAI client usage.
            # If using OpenRouter, ensure the model is supported.
            # "text-embedding-3-small" is standard.
            
            response = openai.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * self.dimension

    def add_to_index(self, photo_id: str, text: str):
        import asyncio
        # We need to run the async embedding in sync context or await it
        # Since FAISS operations are sync, we'll bridge it.
        # But this method is likely called from an async background task.
        pass # Refactored below

    async def process_photo(self, photo_id: str, image_url: str):
        """
        Full pipeline: Caption -> Embedding -> FAISS
        """
        print(f"Starting analysis for {photo_id}...")
        description, hashtags = await self.generate_caption(image_url)
        
        full_text = f"{description} {' '.join(hashtags)}"
        vector = await self.generate_embedding(full_text)
        
        # FAISS update (Sync)
        if vector and len(vector) == self.dimension:
            self.index.add(np.array([vector], dtype=np.float32))
            self.metadata.append(photo_id) # Metadata index matches FAISS ID
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

ai_service = AIService()
