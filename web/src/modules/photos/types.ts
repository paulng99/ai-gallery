export type Photo = {
  id: string;
  fileId?: string;
  fileName: string;
  fileUrl?: string;
  mimeType?: string;
  activityName?: string;
  activityDate?: string;
  location?: string;
  groupName?: string;
  owner?: string;
  description?: string;
  hashtags?: string;
  aiAnalysisStatus?: string;
  createdAt: string;
};

export type ActivityGroup = {
  activityName: string;
  count: number;
  coverPhoto: Photo;
};
