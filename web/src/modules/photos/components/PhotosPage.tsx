'use client';

import { useState } from "react";
import { usePhotos } from "../hooks/usePhotos";
import PhotosForm from "./PhotosForm";
import PhotosGrid from "./PhotosGrid";
import { Globe, Plus, Images, Search } from "lucide-react";
import clsx from "clsx";

type LocaleKey = "hk" | "zh" | "en";

const copy = {
  hk: {
    pageTitle: "校園相簿",
    uploadTitle: "上傳相片",
    file: "相片檔案",
    activityName: "活動名稱",
    activityDate: "活動日期",
    location: "地點",
    groupName: "負責組別",
    owner: "負責人",
    upload: "開始上傳",
    empty: "暫無相片",
    allPhotos: "所有相片",
    switchToUpload: "上傳新相片",
    switchToList: "返回列表",
    searchPlaceholder: "搜尋相片 (例如: 跑步、頒獎...)",
    searchResults: "搜尋結果",
  },
  zh: {
    pageTitle: "校园相册",
    uploadTitle: "上传照片",
    file: "照片文件",
    activityName: "活动名称",
    activityDate: "活动日期",
    location: "地点",
    groupName: "负责组别",
    owner: "负责人",
    upload: "开始上传",
    empty: "暂无照片",
    allPhotos: "所有照片",
    switchToUpload: "上传新照片",
    switchToList: "返回列表",
    searchPlaceholder: "搜索照片 (例如: 跑步、颁奖...)",
    searchResults: "搜索结果",
  },
  en: {
    pageTitle: "School Gallery",
    uploadTitle: "Upload Photos",
    file: "Photo File",
    activityName: "Activity Name",
    activityDate: "Activity Date",
    location: "Location",
    groupName: "Group",
    owner: "Owner",
    upload: "Start Upload",
    empty: "No photos yet",
    allPhotos: "All Photos",
    switchToUpload: "Upload New",
    switchToList: "Back to List",
    searchPlaceholder: "Search photos (e.g. running, award...)",
    searchResults: "Search Results",
  },
};

export default function PhotosPage() {
  const [locale, setLocale] = useState<LocaleKey>("hk");
  const [view, setView] = useState<"list" | "upload">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const { photos, loading, upload, search } = usePhotos();
  const labels = copy[locale];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Images className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              {labels.pageTitle}
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            />
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === "list" ? "upload" : "list")}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                view === "list"
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {view === "list" ? (
                <>
                  <Plus className="w-4 h-4" />
                  {labels.switchToUpload}
                </>
              ) : (
                labels.switchToList
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <Globe className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block p-1">
                {(["hk", "zh", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      locale === l ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {l === "hk" ? "繁體中文" : l === "zh" ? "简体中文" : "English"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === "upload" ? (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PhotosForm
              labels={{
                title: labels.uploadTitle,
                file: labels.file,
                activityName: labels.activityName,
                activityDate: labels.activityDate,
                location: labels.location,
                groupName: labels.groupName,
                owner: labels.owner,
                upload: labels.upload,
              }}
              loading={loading}
              onUpload={async (payload) => {
                await upload(payload);
                setView("list");
              }}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                {searchQuery ? labels.searchResults : labels.allPhotos}
              </h2>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                {photos.length} items
              </span>
            </div>
            <PhotosGrid
              photos={photos}
              labels={{
                empty: labels.empty,
                activityName: labels.activityName,
                activityDate: labels.activityDate,
                location: labels.location,
                groupName: labels.groupName,
                owner: labels.owner,
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
