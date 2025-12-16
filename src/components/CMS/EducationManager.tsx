import React, { useCallback, useEffect, useState } from "react";

import httpClient from "@/services/httpClient";
import { toList } from "@/utils/api";

export type EducationItem = {
  id?: string;
  _id?: string;
  school: string;
  degree: string;
  from?: string;
  to?: string;
};

const endpoint = "educations";

export default function EducationManager() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EducationItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EducationItem>({
    school: "",
    degree: "",
    from: "",
    to: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get(endpoint).json<unknown>();
      const list = toList<EducationItem>(res).map((it) => ({
        ...it,
        id: it.id ?? it._id,
      }));
      setItems(list);
    } catch (err) {
      setError("Không lấy được dữ liệu education từ API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ school: "", degree: "", from: "", to: "" });
    setShowForm(true);
  }

  function openEdit(item: EducationItem) {
    setEditing(item);
    setForm({
      school: item.school ?? "",
      degree: item.degree ?? "",
      from: item.from ?? "",
      to: item.to ?? "",
      id: item.id,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing?.id) {
        await httpClient
          .patch(`${endpoint}/${editing.id}`, { json: form })
          .json();
      } else {
        await httpClient.post(endpoint, { json: form }).json();
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError("Lưu education thất bại");
      console.error(err);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xoá mục này?")) return;
    try {
      await httpClient.delete(`${endpoint}/${id}`).json();
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Education</h2>
        <button
          onClick={openCreate}
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

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id ?? JSON.stringify(it)}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded p-3 gap-3"
          >
            <div>
              <div className="font-semibold">{it.school}</div>
              <div className="text-sm text-gray-700">{it.degree}</div>
              <div className="text-xs text-gray-500">
                {it.from} - {it.to}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(it)}
                className="px-2 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(it.id)}
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
                {editing ? "Edit" : "Create"} education
              </div>
              <button className="px-2" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={save} className="space-y-3 p-4">
              <div>
                <label className="block text-sm font-medium mb-1">School</label>
                <input
                  value={form.school}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, school: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Degree</label>
                <input
                  value={form.degree}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, degree: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <input
                    value={form.from ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, from: e.target.value }))
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <input
                    value={form.to ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, to: e.target.value }))
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
