import React, { useState } from "react";

import EducationForm from "@/components/CMS/forms/EducationForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
import { useResourceManager } from "@/hooks/useResourceManager";

type EducationItem = {
  id?: string;
  _id?: string;
  school: string;
  degree: string;
  from?: string;
  to?: string;
};

export default function EducationManager() {
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
  } = useResourceManager<EducationItem>("educations");

  const [form, setForm] = useState<EducationItem>({
    school: "",
    degree: "",
    from: "",
    to: "",
  });

  const handleOpenCreate = () => {
    setForm({ school: "", degree: "", from: "", to: "" });
    openCreate();
  };

  const handleOpenEdit = (item: EducationItem) => {
    setForm({
      school: item.school ?? "",
      degree: item.degree ?? "",
      from: item.from ?? "",
      to: item.to ?? "",
      id: item.id,
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
        <h2 className="text-lg font-semibold">Education</h2>
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
              <div className="font-semibold">{it.school}</div>
              <div className="text-sm text-gray-700">{it.degree}</div>
              <div className="text-xs text-gray-500">
                {it.from} - {it.to}
              </div>
            </div>
            <ListItemActions
              onEdit={() => handleOpenEdit(it)}
              onDelete={() => remove(it.id)}
            />
          </div>
        ))}
      </div>

      <EducationForm
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
