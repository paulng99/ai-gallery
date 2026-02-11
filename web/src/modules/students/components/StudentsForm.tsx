'use client';

import { useState } from "react";
import { useStudents } from "../hooks/useStudents";

export default function StudentsForm() {
  const { add, refresh, loading } = useStudents();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");

  async function onAdd() {
    if (!name.trim()) return;
    await add({ name, className });
    setName("");
    setClassName("");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 text-black w-48"
          placeholder="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black w-48"
          placeholder="班級"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button
          onClick={onAdd}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          新增
        </button>
        <button
          onClick={refresh}
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          重新整理
        </button>
      </div>
    </div>
  );
}
