/**
 * Central i18n copy for AI Gallery.
 * Locales: zh-HK (hk), zh-CN (zh), en (eng). Date format: yyyy-mm-dd.
 */
export type LocaleKey = "hk" | "zh" | "en";

export const copy = {
  nav: {
    hk: {
      albums: "相簿",
      students: "學生",
      searchPlaceholder: "搜尋相片...",
      login: "登入",
      language: "語言",
    },
    zh: {
      albums: "相册",
      students: "学生",
      searchPlaceholder: "搜索照片...",
      login: "登录",
      language: "语言",
    },
    en: {
      albums: "Albums",
      students: "Students",
      searchPlaceholder: "Search photos...",
      login: "Sign in",
      language: "Language",
    },
  },
  footer: {
    hk: { copyright: "© 2026 學校活動相片管理系統. All rights reserved." },
    zh: { copyright: "© 2026 学校活动相片管理系统. All rights reserved." },
    en: { copyright: "© 2026 School Photo Management System. All rights reserved." },
  },
  photos: {
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
  },
} as const;

/** Map locale to html lang attribute */
export const localeToHtmlLang: Record<LocaleKey, string> = {
  hk: "zh-HK",
  zh: "zh-CN",
  en: "en",
};

export const localeLabels: Record<LocaleKey, string> = {
  hk: "繁體中文",
  zh: "简体中文",
  en: "English",
};
