import React, { useState } from "react";

import EducationForm from "@/components/CMS/forms/EducationForm";
import ItemDetail from "@/components/CMS/shared/ItemDetail";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
import TimeStartEnd from "@/components/CMS/shared/TimeStartEnd";
import { useResourceManager } from "@/hooks/useResourceManager";

type EducationItem = {
  id?: string;
  _id?: string;
  school: string;
  degree: string;
  startAt?: string;
  endAt?: string;
  GPA?: string;
  description?: string;
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
  } = useResourceManager<EducationItem>("education");

  const [form, setForm] = useState<EducationItem>({
    school: "",
    degree: "",
    startAt: "",
    endAt: "",
  });

  const handleOpenCreate = () => {
    setForm({ school: "", degree: "", startAt: "", endAt: "" });
    openCreate();
  };

  const handleOpenEdit = (item: EducationItem) => {
    setForm({
      school: item.school ?? "",
      degree: item.degree ?? "",
      startAt: item.startAt ?? "",
      endAt: item.endAt ?? "",
      GPA: item.GPA ?? "",
      description: item.description ?? "",
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
              <ItemDetail label="School" value={it.school} />
              <ItemDetail label="Degree" value={it.degree} />
              <ItemDetail label="GPA" value={it.GPA} />
              <TimeStartEnd start={it.startAt} end={it.endAt} />
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
