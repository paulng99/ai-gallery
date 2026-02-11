'use client';

import { useState } from "react";
import { useFeature } from "../hooks/useFeature";
import type { FeatureItem } from "../types";

export default function FeatureForm() {
  const { addItem, fetchPing, loading } = useFeature();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function onAdd() {
    const item: FeatureItem = {
      id: crypto.randomUUID(),
      title,
      description,
    };
    addItem(item);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 text-black w-48"
          placeholder="標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black flex-1"
          placeholder="描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={onAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          新增
        </button>
      </div>
      <button
        onClick={fetchPing}
        disabled={loading}
        className="border px-4 py-2 rounded"
      >
        呼叫後端
      </button>
    </div>
  );
}
