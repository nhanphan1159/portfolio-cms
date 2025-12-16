import React, { useCallback, useEffect, useState } from "react";

import httpClient from "@/services/httpClient";
import { toSingle } from "@/utils/api";

type AboutItem = {
  id?: string;
  _id?: string;
  content: string;
  name: string;
  role: string;
};

const endpoint = "about";

export default function AboutManager() {
  const [items, setItems] = useState<AboutItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AboutItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AboutItem>({
    content: "",
    name: "",
    role: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get(endpoint).json<unknown>();
      setItems(toSingle<AboutItem>(res));
    } catch (err) {
      setError("Không lấy được dữ liệu about từ API");
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
    setForm({ content: "", name: "", role: "" });
    setShowForm(true);
  }

  function openEdit(item: AboutItem) {
    setEditing(item);
    setForm({
      content: item.content ?? "",
      id: item.id,
      name: item.name ?? "",
      role: item.role ?? "",
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
      setError("Lưu about thất bại");
      console.error(err);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xoá mục này?")) return;
    try {
      await httpClient.delete(`${endpoint}/${id}`).json();
      setItems(null);
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  }

  console.log("items", items);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">About</h2>
        <button
          onClick={openCreate}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !items && (
        <div className="text-sm text-gray-500">Chưa có dữ liệu</div>
      )}

      {items && (
        <div className="space-y-2 border rounded p-3">
          <div>
            {items.name && (
              <div className="text-sm font-medium text-gray-800">
                {items.name}
              </div>
            )}
            {items.role && (
              <div className="text-sm text-gray-600">{items.role}</div>
            )}
            <div className="text-sm text-gray-700 whitespace-pre-line mt-2">
              {items.content}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEdit(items)}
              className="px-2 py-1 border rounded"
            >
              Edit
            </button>
            <button
              onClick={() => remove(items.id)}
              className="px-2 py-1 border rounded text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded shadow w-full max-w-lg">
            <div className="border-b p-3 flex justify-between items-center">
              <div className="font-semibold">
                {editing ? "Edit" : "Create"} about
              </div>
              <button className="px-2" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={save} className="space-y-3 p-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, content: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  value={form.role ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, role: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                />
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
