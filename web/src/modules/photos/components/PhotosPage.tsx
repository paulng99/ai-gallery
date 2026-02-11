'use client';

import { useState } from "react";
import { usePhotos } from "../hooks/usePhotos";
import PhotosForm from "./PhotosForm";
import PhotosGrid from "./PhotosGrid";

type LocaleKey = "hk" | "zh" | "en";

const copy = {
  hk: {
    pageTitle: "相片管理",
    uploadTitle: "上傳相片",
    file: "相片檔案",
    activityName: "活動名稱",
    activityDate: "活動日期",
    location: "地點",
    groupName: "負責組別",
    owner: "負責人",
    upload: "上傳",
    empty: "暫無相片",
    languageLabel: "語言",
    allPhotos: "相片列表",
  },
  zh: {
    pageTitle: "照片管理",
    uploadTitle: "上传照片",
    file: "照片文件",
    activityName: "活动名称",
    activityDate: "活动日期",
    location: "地点",
    groupName: "负责组别",
    owner: "负责人",
    upload: "上传",
    empty: "暂无照片",
    languageLabel: "语言",
    allPhotos: "照片列表",
  },
  en: {
    pageTitle: "Photo Management",
    uploadTitle: "Upload Photos",
    file: "Photo File",
    activityName: "Activity Name",
    activityDate: "Activity Date",
    location: "Location",
    groupName: "Group",
    owner: "Owner",
    upload: "Upload",
    empty: "No photos yet",
    languageLabel: "Language",
    allPhotos: "All Photos",
  },
};

export default function PhotosPage() {
  const [locale, setLocale] = useState<LocaleKey>("hk");
  const { photos, loading, upload } = usePhotos();
  const labels = copy[locale];

  return (
    <div className="min-h-screen p-8 space-y-8 bg-zinc-50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{labels.languageLabel}</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as LocaleKey)}
            className="border rounded px-2 py-1 text-black"
          >
            <option value="hk">HK</option>
            <option value="zh">简体</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
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
        }}
      />
      <div className="space-y-3">
        <div className="text-lg font-semibold">{labels.allPhotos}</div>
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
    </div>
  );
}
