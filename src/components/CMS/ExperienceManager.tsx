import React, { useState } from "react";

import LoadingError from "@/components/CMS/shared/LoadingError";
import Modal from "@/components/CMS/shared/Modal";
import { useResourceManager } from "@/hooks/useResourceManager";

type ExperienceItem = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  startAt: string;
  endAT: string;
  job: string;
};

export default function ExperienceManager() {
  const {
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
  } = useResourceManager<ExperienceItem>("experience");

  const [form, setForm] = useState<ExperienceItem>({
    company: "",
    role: "",
    startAt: "",
    endAT: "",
    job: "",
  });

  const handleOpenCreate = () => {
    setForm({ company: "", role: "", startAt: "", endAT: "", job: "" });
    openCreate();
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setForm({
      company: item.company ?? "",
      role: item.role ?? "",
      startAt: item.startAt ?? "",
      endAT: item.endAT ?? "",
      id: item.id,
      job: item.job ?? "",
    });
    openEdit(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save(form);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Experience</h2>
        <button
          onClick={handleOpenCreate}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>

      <LoadingError loading={loading} error={error} itemsCount={items.length} />

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id ?? JSON.stringify(it)}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded p-3 gap-3"
          >
            <div>
              <div className="font-semibold">{it.company}</div>
              <div className="text-sm text-gray-700">{it.role}</div>
              <div className="text-xs text-gray-500">
                {it.startAt} - {it.endAT}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenEdit(it)}
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

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Experience" : "Create Experience"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              value={form.company}
              onChange={(e) =>
                setForm((s) => ({ ...s, company: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                value={form.startAt ?? ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, startAt: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
                placeholder="YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                value={form.endAT ?? ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, endAT: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
                placeholder="YYYY"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">JOB</label>
            <textarea
              value={form.job ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, job: e.target.value }))}
              className="w-full border rounded px-2 py-1 resize-none h-20"
              placeholder="YYYY"
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
