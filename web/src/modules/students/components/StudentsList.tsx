'use client';

import { useStudents } from "../hooks/useStudents";

export default function StudentsList() {
  const { students } = useStudents();
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">學生列表</h2>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id} className="border rounded px-3 py-2">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-gray-500">{s.className}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
