# 學校活動相片管理系統 (AI Gallery) 開發計劃

## 1. 系統概覽 (System Overview)
本系統旨在為學校行政提供一個智能化的相片管理平台，結合 Next.js 的現代化前端與 FastAPI 的強大 AI 處理能力。利用 Google Drive 作為低成本存儲，並整合 LLM 與人臉識別技術，實現高效的相片檢索與歸檔。

**當前狀態:** Phase 1 & Phase 2 已完成，Phase 3-5 待開發。

## 2. 技術架構 (Technical Architecture)

### 前端 (Frontend)
*   **Framework:** Next.js 16 (App Router)
*   **UI Library:** Tailwind CSS 4 + shadcn/ui
*   **Language:** TypeScript
*   **Auth:** NextAuth.js (Google OAuth + Credentials for Admin)
*   **Animation:** Framer Motion

### 後端 (Backend - Hybrid)
*   **Main Server (Next.js API Routes):** 處理業務邏輯、權限控制 (RBAC)、數據庫 CRUD、與 Google Drive API 交互。
*   **AI Service (FastAPI):** 專門處理計算密集型任務：
    *   相片內容分析 (Captioning/Tagging)
    *   人臉識別與特徵提取 (Face Recognition)
    *   向量數據庫管理 (FAISS)

### 存儲 (Storage)
*   **File Storage:** Google Drive (Shared Folder) - 透過 Service Account 存取。
*   **Metadata Database:** SQLite (ai-service/data/photos.db)
*   **Vector Database:** FAISS (運行於 FastAPI 服務中，存儲圖像特徵與人臉特徵)

### AI 服務整合 (AI Services)
*   **VLM (視覺語言模型):** OpenRouter API (Qwen-2-VL-7B) 進行相片描述與標籤生成
*   **Embeddings:** OpenRouter (text-embedding-3-small) 或回退機制

## 3. 模組化設計 (Modular MVC Structure)

```
ai-service/
├── modules/ai/        # AI 分析服務 (FAISS, Captioning, Search)
├── modules/photos/    # 相片 CRUD + Google Drive 上傳
├── modules/students/  # 學生管理 (待開發)
└── modules/template/  # 範本模組

web/
├── src/app/           # Next.js 頁面 + API Routes
├── src/modules/       # 功能模組
│   ├── auth/          # 用戶認證
│   ├── photos/        # 相片管理
│   ├── students/      # 學生管理
│   └── search/        # 搜尋功能
└── src/components/ui/ # shadcn/ui 組件
```

## 4. 開發進度 (Development Progress)

### ✅ Phase 1: 基礎架構完善 (已完成)
- [x] AI Service 路由重構
- [x] OpenRouter 整合 (Qwen VL 模型)
- [x] API Endpoints:
  - `POST /ai/analyze/image` - 單張相片分析
  - `POST /ai/analyze/photo/{id}` - 按 ID 分析
  - `POST /ai/analyze/batch` - 批量分析
  - `GET /ai/analyze/status/{id}` - 狀態查詢
  - `POST /ai/search/semantic` - 語意搜尋
  - `GET /ai/stats` - 統計資訊
- [x] 數據庫更新 (description, hashtags, embedding_status)
- [x] 背景任務處理

### ✅ Phase 2: 語意搜尋功能 (已完成)
- [x] FAISS 向量索引管理
- [x] 語意搜尋 API
- [x] 分頁支援

### 🔄 Phase 3: 人臉辨識系統 (待開發)
- [ ] 學生人臉資料庫模型設計
- [ ] 人臉檢測 (face_recognition 庫)
- [ ] 人臉特徵提取 (Embeddings)
- [ ] 人臉比對 API
- [ ] 未知人臉標記與命名介面

### ⏳ Phase 4: 認證系統 (待開發)
- [ ] NextAuth.js 配置
- [ ] Google OAuth 整合
- [ ] Admin 登入 (Credentials)
- [ ] RBAC 權限控制
- [ ] API 保護

### ⏳ Phase 5: Google Drive 整合 (待開發)
- [ ] Service Account 配置
- [ ] 自動化上傳流程
- [ ] 權限管理 (分享連結)
- [ ] 檔案清理策略

## 5. 核心功能詳細規劃

### 5.1 用戶認證與權限 (Auth & RBAC) - Phase 4
*   **登入方式:**
    *   **Google Login:** 適用於全校師生 (限制特定 domain)
    *   **Admin Login:** 預設管理員帳號 (Username/Password)
*   **角色 (Roles):**
    *   `Admin`: 管理所有相片、標籤人臉、系統設定
    *   `Uploader` (e.g. 老師): 上載相片、編輯自己上載的活動
    *   `Viewer` (e.g. 學生/家長): 僅瀏覽與搜索

### 5.2 相片上載與管理 - Phase 5
*   **上載流程:**
    1.  填寫表單：活動名稱、日期、地點、負責組別、負責人
    2.  選擇相片 (支持多圖)
    3.  前端壓縮預覽 -> 上載至 Google Drive
    4.  後台異步觸發 AI 分析
*   **Google Drive 整合:** 建立結構化文件夾 `/{Year}/{Activity_Name}/`

### 5.3 AI 智能分析 - Phase 1 & 3
*   **內容標註:** 使用 OpenRouter (Qwen-2-VL) 生成描述 (Caption) 與關鍵字 (Hashtags)
*   **人臉識別 (Phase 3):**
    1.  檢測相片中的人臉
    2.  計算人臉特徵向量 (Embeddings)
    3.  與已知學生特徵庫比對 (FAISS)
    4.  若為未知人臉，標記為 `Unknown_ID`，待管理員命名
    5.  **學習機制:** 當管理員將 `Unknown_ID` 標記為 "陳大文"，系統自動更新該特徵向量的標籤

### 5.4 智能搜索
*   **語意搜索 (Semantic Search):**
    *   用戶輸入: "操場上跑步的學生"
    *   LLM 轉換: 提取關鍵字
    *   FAISS 檢索: 找出圖像內容向量最接近的相片
*   **人臉搜索 (Phase 3):**
    *   輸入學生姓名 -> 查找其 Face ID -> 在 FAISS 中檢索含有該 Face ID 的相片

## 6. API 端點

### AI 分析
| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/ai/analyze/image` | 單張圖片分析 |
| POST | `/ai/analyze/photo/{photo_id}` | 按 ID 分析相片 |
| POST | `/ai/analyze/batch` | 批量相片分析 |
| GET | `/ai/analyze/status/{photo_id}` | 分析狀態查詢 |
| POST | `/ai/search/semantic` | 語意搜尋 |
| GET | `/ai/stats` | AI 服務統計 |

### 相片管理
| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/photos` | 列出相片 |
| POST | `/photos` | 上傳相片 |
| GET | `/photos/groups` | 活動分組 |

## 7. 數據庫結構

### photos 表 (SQLite)
```sql
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  file_id TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT,
  mime_type TEXT,
  activity_name TEXT,
  activity_date TEXT,
  location TEXT,
  group_name TEXT,
  owner TEXT,
  created_at TEXT NOT NULL,
  description TEXT,
  hashtags TEXT,
  embedding_status TEXT DEFAULT 'pending'
)
```

## 8. 快速開始

```bash
# 前端
cd web
npm run dev

# 後端
cd ai-service
python3 main.py
```

## 9. 環境變數

### ai-service/.env
```
OPENAI_API_KEY=your-openrouter-api-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
PHOTO_DB_PATH=./data/photos.db
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```
