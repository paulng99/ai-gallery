import { useState } from "react";
import type { FeatureItem } from "../types";

export function useFeature() {
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPing() {
    setLoading(true);
    try {
      const res = await fetch("/api/feature-template");
      const data = await res.json();
      return data;
    } finally {
      setLoading(false);
    }
  }

  function addItem(item: FeatureItem) {
    setItems((prev) => [...prev, item]);
  }

  return { items, loading, fetchPing, addItem };
}
