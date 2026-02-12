# Phase 1: 基礎架構完善 (AI 分析服務)

## 目標
實現 AI 相片分析服務，整合 fal.ai 生成相片描述和標籤。

---

## 任務清單

### 1. AI Service 路由重構
- [x] 更新 `ai-service/main.py` 路由結構
- [x] 分離 AI 分析相關 endpoint

### 2. fal.ai 整合
- [x] 在 `ai-service/modules/ai/service.py` 實現 AI 服務類 (使用 GPT-4o-mini via OpenRouter)
- [x] 配置 fal.ai API Key (通過 OPENAI_API_KEY)
- [x] 實現相片描述生成 (Captioning)
- [x] 實現關鍵字提取 (Hashtags)

### 3. API Endpoints
- [x] `POST /ai/analyze/image` - 單張相片分析
- [x] `POST /ai/analyze/photo/{photo_id}` - 按 ID 分析相片
- [x] `POST /ai/analyze/batch` - 批量相片分析
- [x] `GET /ai/analyze/status/{photo_id}` - 分析狀態查詢
- [x] `POST /ai/search/semantic` - 語意搜尋
- [x] `GET /ai/stats` - AI 服務統計

### 4. 數據庫更新
- [x] 確認 `photos` 表包含 `description`, `hashtags`, `embedding_status` 欄位
- [x] 新增 `get_photo_by_id()` 函數

### 5. 異步任務處理
- [x] 實現背景任務機制 (FastAPI BackgroundTasks)
- [x] 相片上傳後自動觸發 AI 分析

---

## 技術細節

### fal.ai 整合
```python
# 使用的模型建議
- 圖像描述: fal-ai/llava (視覺語言模型)
- 或 CLIP: openai/clip-vit-large-patch14
```

### API Response 格式
```json
{
  "photo_id": "uuid",
  "description": "学生在操场上跑步",
  "hashtags": ["学生", "跑步", "操场", "体育课"],
  "confidence": 0.95,
  "status": "completed"
}
```

---

## 預估工作量
- 預計時間: 1-2 天
- 難度: 中等

---

## 下一步
完成後進入 **Phase 2: 語意搜尋功能** 