"use client";

import { useState } from "react";
import { usePhotos } from "../hooks/usePhotos";
import PhotosForm from "./PhotosForm";
import PhotosGrid from "./PhotosGrid";
import { Globe, Plus, Images, Search, LayoutGrid, ChevronLeft } from "lucide-react";
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
    viewAlbums: "活動相簿",
    viewAll: "所有相片",
    backToAlbums: "返回相簿",
    items: "張相片",
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
    viewAlbums: "活动相册",
    viewAll: "所有照片",
    backToAlbums: "返回相册",
    items: "张照片",
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
    viewAlbums: "Albums",
    viewAll: "All Photos",
    backToAlbums: "Back to Albums",
    items: "items",
  },
};

export default function PhotosPage() {
  const [locale, setLocale] = useState<LocaleKey>("hk");
  const [view, setView] = useState<"albums" | "grid" | "upload">("albums");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { photos, groups, loading, upload, search, filterByActivity } = usePhotos();
  const labels = copy[locale];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchQuery);
    setView("grid");
    setSelectedActivity(null);
  };

  const handleActivityClick = (activityName: string) => {
    setSearchQuery(activityName);
    filterByActivity(activityName);
    setSelectedActivity(activityName);
    setView("grid");
  };

  const handleBackToAlbums = () => {
    setSearchQuery("");
    search(""); // Reset search
    setSelectedActivity(null);
    setView("albums");
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToAlbums}>
            <div className="p-2 bg-blue-800 rounded-lg">
              <Images className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">
              {labels.pageTitle}
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto relative hidden md:block px-4">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all outline-none shadow-sm placeholder:text-gray-400"
            />
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === "upload" ? "albums" : "upload")}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                view === "upload"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-800 text-white hover:bg-blue-900 shadow-md hover:shadow-lg"
              )}
            >
              {view === "upload" ? (
                labels.switchToList
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {labels.switchToUpload}
                </>
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
                handleBackToAlbums(); // Go back to albums after upload
              }}
            />
          </div>
        ) : view === "albums" ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" />
                {labels.viewAlbums}
              </h2>
              <button 
                onClick={() => setView("grid")}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {labels.viewAll}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groups.map((group) => (
                <div 
                  key={group.activityName}
                  onClick={() => handleActivityClick(group.activityName)}
                  className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    {group.coverPhoto.fileUrl ? (
                      <img 
                        src={group.coverPhoto.fileUrl} 
                        alt={group.activityName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Images className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-medium text-lg truncate">
                        {group.activityName}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {group.count} {labels.items}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {groups.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  {labels.empty}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedActivity && (
                  <button 
                    onClick={handleBackToAlbums}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedActivity ? selectedActivity : (searchQuery ? labels.searchResults : labels.allPhotos)}
                </h2>
              </div>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                {photos.length} {labels.items}
              </span>
            </div>
            <PhotosGrid
              photos={photos}
              labels={labels}
              onActivityClick={!selectedActivity ? handleActivityClick : undefined}
            />
          </div>
        )}
      </main>
    </div>
  );
}
