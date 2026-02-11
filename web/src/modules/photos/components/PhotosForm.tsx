'use client';

import { useState } from "react";
import { UploadCloud, Calendar, MapPin, Users, User, Tag, Loader2 } from "lucide-react";
import clsx from "clsx";

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
  const [preview, setPreview] = useState<string | null>(null);
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
    setPreview(null);
    setActivityName("");
    setActivityDate("");
    setLocation("");
    setGroupName("");
    setOwner("");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          {labels.title}
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Upload Area */}
        <div className="group relative border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-500 hover:bg-blue-50/50 text-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label={labels.file}
          />
          {preview ? (
            <div className="relative w-full aspect-video max-w-sm mx-auto rounded-lg overflow-hidden shadow-md">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium">Click to change</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="p-4 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
              </div>
              <div>
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          )}
        </div>

        {/* Metadata Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> {labels.activityName}
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Sports Day 2024"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {labels.activityDate}
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {labels.location}
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Main Hall"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {labels.groupName}
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Science Club"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {labels.owner}
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Mr. Chan"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-md",
              loading || !file
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            {labels.upload}
          </button>
        </div>
      </div>
    </div>
  );
}
