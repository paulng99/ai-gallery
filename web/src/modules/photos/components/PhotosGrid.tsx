'use client';

import Image from "next/image";
import type { Photo } from "../types";

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
    return <div className="text-gray-500">{labels.empty}</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <div key={photo.id} className="border rounded overflow-hidden bg-white">
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
            {photo.fileUrl ? (
              <Image
                src={photo.fileUrl}
                alt={photo.activityName || photo.fileName}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="text-sm text-gray-400">{photo.fileName}</div>
            )}
          </div>
          <div className="p-3 space-y-1 text-sm">
            <div className="font-medium">{photo.activityName || photo.fileName}</div>
            {photo.activityDate && (
              <div>
                <span className="text-gray-500">{labels.activityDate}:</span>{" "}
                {photo.activityDate}
              </div>
            )}
            {photo.location && (
              <div>
                <span className="text-gray-500">{labels.location}:</span>{" "}
                {photo.location}
              </div>
            )}
            {photo.groupName && (
              <div>
                <span className="text-gray-500">{labels.groupName}:</span>{" "}
                {photo.groupName}
              </div>
            )}
            {photo.owner && (
              <div>
                <span className="text-gray-500">{labels.owner}:</span> {photo.owner}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
