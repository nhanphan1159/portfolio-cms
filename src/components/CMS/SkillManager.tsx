import React, { useState } from "react";

import SkillForm from "@/components/CMS/forms/SkillForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
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
              <ListItemActions
                onEdit={() => openEdit(it)}
                onDelete={() => remove(it.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <SkillForm
        isOpen={showForm}
        isEditing={!!editing}
        form={form}
        onFormChange={setForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
