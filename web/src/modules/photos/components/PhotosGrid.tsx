'use client';

import Image from "next/image";
import type { Photo } from "../types";
import { Calendar, MapPin, Users, User, Clock, Image as ImageIcon } from "lucide-react";

type Labels = {
  empty: string;
  activityName: string;
  activityDate: string;
  location: string;
  groupName: string;
  owner: string;
};

type Props = {
  photos: Photo[];
  labels: Labels;
};

export default function PhotosGrid({ photos, labels }: Props) {
  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <ImageIcon className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-gray-500 font-medium">{labels.empty}</div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="break-inside-avoid bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="relative w-full bg-gray-100" style={{ aspectRatio: '4/3' }}>
            {photo.fileUrl ? (
              <Image
                src={photo.fileUrl}
                alt={photo.activityName || photo.fileName}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 bg-gray-100">
                <ImageIcon className="w-8 h-8 opacity-20" />
              </div>
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg">
              {photo.activityName || <span className="text-gray-400 italic">Untitled</span>}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              {photo.activityDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{photo.activityDate}</span>
                </div>
              )}
              
              {photo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span className="line-clamp-1">{photo.location}</span>
                </div>
              )}

              {(photo.groupName || photo.owner) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {photo.groupName && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      <Users className="w-3 h-3" />
                      {photo.groupName}
                    </span>
                  )}
                  {photo.owner && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      <User className="w-3 h-3" />
                      {photo.owner}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Description & Hashtags */}
            {(photo.description || photo.hashtags) && (
              <div className="pt-2 border-t border-gray-50 space-y-2">
                {photo.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{photo.description}</p>
                )}
                {photo.hashtags && (
                  <div className="flex flex-wrap gap-1">
                    {photo.hashtags.split(',').slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(photo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
