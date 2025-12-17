/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import httpClient from "@/services/httpClient";

export type ResourceItem = {
  id?: string;
  _id?: string;
  [key: string]: any;
};

export function useResourceManager<T extends ResourceItem>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);

  const normList = useCallback((res: any): T[] => {
    const arr = Array.isArray(res) ? res : [res];
    return arr.map((it: any) => ({ ...it, id: it.id ?? it._id }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get(endpoint).json<any>();
      setItems(normList(res));
    } catch (err) {
      setError(`Không lấy được dữ liệu ${endpoint} từ API`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, normList]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setShowForm(true);
  };

  const save = async (formData: Partial<T>) => {
    try {
      if (editing?.id) {
        await httpClient
          .patch(`${endpoint}/${editing.id}`, { json: formData })
          .json();
      } else {
        await httpClient.post(endpoint, { json: formData }).json();
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(`Lưu ${endpoint} thất bại`);
      console.error(err);
      throw err;
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xoá mục này?")) return;
    try {
      await httpClient.delete(`${endpoint}/${id}`).json();
      setItems((prev) =>
        Array.isArray(prev) ? prev.filter((it) => it.id !== id) : prev
      );
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  };

  return {
    items,
    loading,
    error,
    editing,
    showForm,
    setShowForm,
    openCreate,
    openEdit,
    save,
    remove,
    load,
  };
}
