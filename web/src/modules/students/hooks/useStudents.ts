import { useEffect, useState } from "react";
import type { Student } from "../types";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function add(student: Omit<Student, "id">) {
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      const data = await res.json();
      if (data.item) {
        setStudents((prev) => [data.item, ...prev]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { students, loading, refresh, add };
}
