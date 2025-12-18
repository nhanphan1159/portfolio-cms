import React, { useState } from "react";

import ExperienceForm from "@/components/CMS/forms/ExperienceForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
import { useResourceManager } from "@/hooks/useResourceManager";

type ExperienceItem = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  startAt: string;
  endAt: string;
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
    endAt: "",
    job: "",
  });

  const handleOpenCreate = () => {
    setForm({ company: "", role: "", startAt: "", endAt: "", job: "" });
    openCreate();
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setForm({
      company: item.company ?? "",
      role: item.role ?? "",
      startAt: item.startAt ?? "",
      endAt: item.endAt ?? "",
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
                {it.startAt} - {it.endAt}
              </div>
            </div>
            <ListItemActions
              onEdit={() => handleOpenEdit(it)}
              onDelete={() => remove(it.id)}
            />
          </div>
        ))}
      </div>

      <ExperienceForm
        isOpen={showForm}
        isEditing={!!editing}
        form={form}
        onFormChange={setForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
