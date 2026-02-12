# AI Gallery 開發計劃 (全階段)

## 項目概覽
智能相片管理系統，結合 Next.js 前端與 FastAPI AI 服務。

---

## ✅ Phase 1: 基礎架構完善 (已完成)
**狀態**: ✅ 完成
**時間**: 1-2 天

### 完成項目
- [x] AI Service 路由重構
- [x] fal.ai/OpenRouter 整合 (GPT-4o-mini)
- [x] API Endpoints:
  - `POST /ai/analyze/image` - 單張相片分析
  - `POST /ai/analyze/photo/{id}` - 按 ID 分析
  - `POST /ai/analyze/batch` - 批量分析
  - `GET /ai/analyze/status/{id}` - 狀態查詢
  - `POST /ai/search/semantic` - 語意搜尋
  - `GET /ai/stats` - 統計資訊
- [x] 數據庫更新 (description, hashtags, embedding_status)
- [x] 背景任務處理

### 新增檔案
- `ai-service/modules/ai/router.py`
- `ai-service/.env.example`

---

## 🔄 Phase 2: 語意搜尋功能
**狀態**: ✅ 已實現核心功能
**預計時間**: 2-3 天

### 已完成 ✅
- [x] 修復搜尋 API 路由
- [x] 添加分頁支援
- [x] FAISS 向量索引管理
- [x] 語意搜尋 API (POST /ai/search/semantic)

### 待完成
- [ ] 實現相似圖片搜尋 (以圖搜圖)
- [ ] 前端搜尋介面優化
- [ ] 搜尋結果高亮顯示
- [ ] 搜尋建議功能

### API Endpoints
- `POST /ai/search/similar` - 以圖搜圖
- `GET /ai/search/history` - 搜尋歷史

### 前端更新
- 搜尋建議功能
- 搜尋結果高亮
- 相關推薦

---

## 📋 Phase 3: 人臉辨識系統
**狀態**: ⏳ 待開始
**預計時間**: 3-4 天

### 任務清單
- [ ] 學生人臉資料庫模型設計
- [ ] 人臉檢測 (face_recognition 庫)
- [ ] 人臉特徵提取 (Embeddings)
- [ ] 人臉比對 API
- [ ] 未知人臉標記與命名介面

### 數據庫模型
```python
class Face:
    id: str
    student_id: str  # 關聯學生
    embedding: List[float]
    photo_id: str    # 來源相片
    bbox: dict       # 邊界框
```

### API Endpoints
- `POST /face/detect` - 檢測相片中的人臉
- `POST /face/identify` - 人臉辨識
- `POST /face/register` - 註冊新人臉
- `GET /face/search/{student_id}` - 搜尋學生照片

### 前端功能
- 人脸標記介面
- 學生人臉管理
- 人脸搜尋結果展示

---

## 🔐 Phase 4: 認證系統
**狀態**: ⏳ 待開始
**預計時間**: 1-2 天

### 任務清單
- [ ] NextAuth.js 配置
- [ ] Google OAuth 整合
- [ ] Admin 登入 (Credentials)
- [ ] RBAC 權限控制
- [ ] API 保護

### 用戶角色
| 角色 | 權限 |
|------|------|
| Admin | 所有權限 |
| Uploader | 上傳、編輯自己的活動 |
| Viewer | 瀏覽、搜尋 |

### API Endpoints
- `POST /auth/login` - 登入
- `GET /auth/me` - 獲取當前用戶
- `POST /auth/logout` - 登出

---

## ☁️ Phase 5: Google Drive 整合
**狀態**: ⏳ 待開始
**預計時間**: 1 天

### 任務清單
- [ ] Service Account 配置
- [ ] 自動化上傳流程
- [ ] 權限管理 (分享連結)
- [ ] 檔案清理策略

### 數據夾結構
```
Google Drive/
└── AI-Gallery/
    └── {Year}/
        └── {Activity_Name}/
            ├── photo1.jpg
            ├── photo2.jpg
            └── ...
```

### API Endpoints
- `POST /drive/upload` - 上傳到 Drive
- `GET /drive/list` - 列出 Drive 檔案
- `DELETE /drive/{file_id}` - 刪除檔案

---

## 📊 總體時間線

| 階段 | 預計時間 | 狀態 |
|------|----------|------|
| Phase 1 | 1-2 天 | ✅ 完成 |
| Phase 2 | 2-3 天 | 🔄 進行中 |
| Phase 3 | 3-4 天 | ⏳ 待開始 |
| Phase 4 | 1-2 天 | ⏳ 待開始 |
| Phase 5 | 1 天 | ⏳ 待開始 |

**總計**: 約 8-12 天

---

## 🔧 技術棧

### 前端
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion
- shadcn/ui

### 後端
- FastAPI (Python)
- SQLite / PostgreSQL
- FAISS (向量數據庫)

### AI 服務
- OpenRouter (GPT-4o-mini)
- face_recognition
- CLIP / LLaVA

### 存儲
- Google Drive (檔案)
- 本地 (向量索引)

---

## 🚀 快速開始

```bash
# 前端
cd web
npm run dev

# 後端
cd ai-service
python3 main.py
```

---

## 📝 備註

- Phase 1 已完成並測試通過
- Phase 2 可與 Phase 3 並行開發
- 建議使用 Docker 部署 production 環境
