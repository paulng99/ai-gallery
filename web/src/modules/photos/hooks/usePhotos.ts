import { useEffect, useState } from "react";
import type { Photo, ActivityGroup } from "../types";

type UploadPhotoPayload = {
  file: File;
  activityName?: string;
  activityDate?: string;
  location?: string;
  groupName?: string;
  owner?: string;
};

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [groups, setGroups] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [photosRes, groupsRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/photos/groups")
      ]);
      
      const photosData = await photosRes.json();
      const groupsData = await groupsRes.json();
      
      setPhotos(photosData.items ?? []);
      setGroups(groupsData.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function upload(payload: UploadPhotoPayload) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", payload.file);
      if (payload.activityName) formData.append("activityName", payload.activityName);
      if (payload.activityDate) formData.append("activityDate", payload.activityDate);
      if (payload.location) formData.append("location", payload.location);
      if (payload.groupName) formData.append("groupName", payload.groupName);
      if (payload.owner) formData.append("owner", payload.owner);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.item) {
        setPhotos((prev) => [data.item, ...prev]);
      }
      return data.item as Photo | undefined;
    } finally {
      setLoading(false);
    }
  }

  async function search(query: string) {
    if (!query.trim()) {
      return refresh();
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/photos/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPhotos(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { photos, groups, loading, refresh, upload, search };
}
