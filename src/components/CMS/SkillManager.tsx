import React, { useState } from "react";

import LoadingError from "@/components/CMS/shared/LoadingError";
import Modal from "@/components/CMS/shared/Modal";
import { useResourceManager } from "@/hooks/useResourceManager";

type SkillItem = {
  id?: string;
  _id?: string;
  name: string;
  level?: string;
};

export default function SkillManager() {
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
  } = useResourceManager<SkillItem>("skills");

  const [form, setForm] = useState<SkillItem>({ name: "", level: "" });

  const handleOpenCreate = () => {
    setForm({ name: "", level: "" });
    openCreate();
  };

  // const handleOpenEdit = (item: SkillItem) => {
  //   setForm({
  //     name: item.name ?? "",
  //     level: item.level ?? "",
  //     id: item.id,
  //   });
  //   openEdit(item);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save(form);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Skills</h2>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Create
          </button>
        </div>

        <LoadingError
          loading={loading}
          error={error}
          itemsCount={items.length}
        />

        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id ?? JSON.stringify(it)}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded p-3 gap-3"
            >
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-700">{it.level}</div>
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
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Skill" : "Create Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <input
              value={form.level ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, level: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="e.g. Advanced"
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
    </>
  );
}
