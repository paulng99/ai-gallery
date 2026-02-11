'use client';

import { useState } from "react";

type Labels = {
  title: string;
  file: string;
  activityName: string;
  activityDate: string;
  location: string;
  groupName: string;
  owner: string;
  upload: string;
};

type Props = {
  labels: Labels;
  loading: boolean;
  onUpload: (payload: {
    file: File;
    activityName?: string;
    activityDate?: string;
    location?: string;
    groupName?: string;
    owner?: string;
  }) => Promise<void>;
};

export default function PhotosForm({ labels, loading, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [location, setLocation] = useState("");
  const [groupName, setGroupName] = useState("");
  const [owner, setOwner] = useState("");

  async function handleUpload() {
    if (!file) return;
    await onUpload({
      file,
      activityName,
      activityDate,
      location,
      groupName,
      owner,
    });
    setFile(null);
    setActivityName("");
    setActivityDate("");
    setLocation("");
    setGroupName("");
    setOwner("");
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">{labels.title}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="border rounded px-3 py-2 text-black"
          type="file"
          accept="image/*"
          aria-label={labels.file}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          placeholder={labels.activityName}
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          type="date"
          placeholder={labels.activityDate}
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          placeholder={labels.location}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          placeholder={labels.groupName}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          placeholder={labels.owner}
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {labels.upload}
      </button>
    </div>
  );
}
