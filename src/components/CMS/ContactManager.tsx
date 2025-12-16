import React, { useCallback, useEffect, useState } from "react";

import LoadingError from "@/components/CMS/shared/LoadingError";
import Modal from "@/components/CMS/shared/Modal";
import httpClient from "@/services/httpClient";
import { toSingle } from "@/utils/api";

type ContactItem = {
  id?: string;
  _id?: string;
  address?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
};

export default function ContactManager() {
  const [items, setItems] = useState<ContactItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ContactItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<ContactItem>({
    address: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get("contact").json<unknown>();
      setItems(toSingle<ContactItem>(res));
    } catch (err) {
      setError("Không lấy được dữ liệu contact từ API");
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
    setForm({ address: "", email: "", phone: "", linkedin: "", github: "" });
    setShowForm(true);
  }

  function openEdit(item: ContactItem) {
    setEditing(item);
    setForm({
      address: item.address ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      linkedin: item.linkedin ?? "",
      github: item.github ?? "",
      id: item.id,
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing?.id) {
        await httpClient.patch(`contact/${editing.id}`, { json: form }).json();
      } else {
        await httpClient.post("contact", { json: form }).json();
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError("Lưu contact thất bại");
      console.error(err);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xoá mục này?")) return;
    try {
      await httpClient.delete(`contact/${id}`).json();
      setItems(null);
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Contact</h2>
        <button
          onClick={openCreate}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>

      <LoadingError
        loading={loading}
        error={error}
        itemsCount={items ? 1 : 0}
      />

      {items && (
        <div className="space-y-2 border rounded p-3">
          <div className="flex-1">
            {items.email && (
              <div className="mb-2">
                <div className="text-xs uppercase text-gray-500">Email</div>
                <div className="font-semibold">{items.email}</div>
              </div>
            )}
            {items.phone && (
              <div className="mb-2">
                <div className="text-xs uppercase text-gray-500">Phone</div>
                <div className="font-semibold">{items.phone}</div>
              </div>
            )}
            {items.address && (
              <div className="mb-2">
                <div className="text-xs uppercase text-gray-500">Address</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {items.address}
                </div>
              </div>
            )}
            {items.linkedin && (
              <div className="mb-2">
                <div className="text-xs uppercase text-gray-500">LinkedIn</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {items.linkedin}
                </div>
              </div>
            )}
            {items.github && (
              <div className="mb-2">
                <div className="text-xs uppercase text-gray-500">GitHub</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {items.github}
                </div>
              </div>
            )}
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

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Contact" : "Create Contact"}
      >
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, phone: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="+84 123 456 789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={form.address ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, address: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              rows={3}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="email"
              value={form.github ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, github: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="email"
              value={form.linkedin ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, linkedin: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="https://linkedin.com/in/username"
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
      </Modal>
    </div>
  );
}
