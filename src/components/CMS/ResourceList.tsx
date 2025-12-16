/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import httpClient from "@/services/httpClient";

import ResourceForm from "./ResourceForm";

type Field = { key: string; label: string; type?: string };

type Props = {
  resourceName: string;
  fields: Field[];
};

export default function ResourceList({ resourceName, fields }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const columns = useMemo(() => fields.map((f) => f.key), [fields]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await httpClient.get(resourceName).json<any>();
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.items)
              ? res.items
              : [];
        setItems(list);
      } catch (err) {
        setError("Không lấy được dữ liệu từ API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resourceName]);

  async function handleSubmit(payload: any) {
    try {
      if (editing?.id) {
        await httpClient
          .patch(`${resourceName}/${editing.id}`, { json: payload })
          .json();
      } else {
        await httpClient.post(resourceName, { json: payload }).json();
      }
      setShowForm(false);
      setEditing(null);
      const res = await httpClient.get(resourceName).json<any>();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.items)
            ? res.items
            : [];
      setItems(list);
    } catch (err) {
      setError("Lưu dữ liệu thất bại");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xoá?")) return;
    try {
      await httpClient.delete(`${resourceName}/${id}`).json();
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold capitalize">{resourceName}</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="text-sm text-gray-500">Chưa có dữ liệu</div>
      )}

      <div className="space-y-2 mt-2">
        {items.map((it) => (
          <div
            key={it.id ?? JSON.stringify(it)}
            className="flex justify-between items-center border rounded p-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {columns.map((col) => (
                <div key={col} className="flex gap-2">
                  <span className="font-medium">{col}:</span>
                  <span>{String(it[col] ?? "")}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button
                onClick={() => {
                  setEditing(it);
                  setShowForm(true);
                }}
                className="px-2 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(it.id)}
                className="px-2 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded shadow w-full max-w-lg">
            <div className="border-b p-3 flex justify-between items-center">
              <div className="font-semibold">
                {editing ? "Edit" : "Create"} {resourceName}
              </div>
              <button className="px-2" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <ResourceForm
              initial={editing || {}}
              fields={fields.map((f) => ({
                key: f.key as any,
                label: f.label,
                type: f.type,
              }))}
              onCancel={() => setShowForm(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
