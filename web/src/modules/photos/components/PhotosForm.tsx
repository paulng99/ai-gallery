"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Calendar, MapPin, Users, User, Loader2, X, Image as ImageIcon, Tag } from "lucide-react";
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
  const [files, setFiles] = useState<File[]>([]);
  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [location, setLocation] = useState("");
  const [groupName, setGroupName] = useState("");
  const [owner, setOwner] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  async function handleUpload() {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress({ current: 0, total: files.length });

    try {
      // Upload files sequentially to avoid overwhelming the server/browser
      for (let i = 0; i < files.length; i++) {
        await onUpload({
          file: files[i],
          activityName,
          activityDate,
          location,
          groupName,
          owner,
        });
        setProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      // Reset form after successful upload
      setFiles([]);
      setActivityName("");
      setActivityDate("");
      setLocation("");
      setGroupName("");
      setOwner("");
    } catch (error) {
      console.error("Upload failed", error);
      // Optional: Handle error (maybe keep remaining files?)
    } finally {
      setUploading(false);
      setProgress({ current: 0, total: 0 });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Manage previews with cleanup to avoid memory leaks
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);
  
  const isBusy = loading || uploading;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-800" />
          {labels.title}
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <div className="group relative border-2 border-dashed border-gray-300 rounded-md p-8 transition-colors hover:border-blue-800 hover:bg-blue-50/50 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label={labels.file}
              disabled={isBusy}
            />
            
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="p-4 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
              </div>
              <div>
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          </div>

          {/* Previews Grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img 
                    src={previews[index]} 
                    alt={`Preview ${index}`} 
                    className="w-full h-full object-cover"
                  />
                  {!isBusy && (
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                    {file.name}
                  </div>
                </div>
              ))}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all placeholder:text-gray-400"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all placeholder:text-gray-400"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all placeholder:text-gray-400"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Mr. Chan"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isBusy || files.length === 0}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-white transition-all shadow-sm",
              isBusy || files.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 hover:shadow-md active:scale-98"
            )}
          >
            {isBusy ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            {isBusy ? `Uploading (${progress.current}/${progress.total})` : labels.upload}
          </button>
        </div>
      </div>
    </div>
  );
}
