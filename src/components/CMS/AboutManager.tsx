import React, { useState } from "react";

import AboutForm from "@/components/CMS/forms/AboutForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
import { useResourceManager } from "@/hooks/useResourceManager";

type AboutItem = {
  id?: string;
  _id?: string;
  content: string;
  name: string;
  role: string;
};

export default function AboutManager() {
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
  } = useResourceManager<AboutItem>("about");

  const [form, setForm] = useState<AboutItem>({
    content: "",
    name: "",
    role: "",
  });

  const handleOpenCreate = () => {
    setForm({ content: "", name: "", role: "" });
    openCreate();
  };

  const handleOpenEdit = (data: AboutItem) => {
    setForm({
      content: data.content ?? "",
      id: data.id,
      name: data.name ?? "",
      role: data.role ?? "",
    });
    openEdit(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save(form);
  };
  console.log("AboutManager rendered", { form, items, editing, showForm });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">About</h2>
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
        itemsCount={items ? 1 : 0}
      />

      {items.map((item) => (
        <div className="space-y-2 border rounded p-3" key={item.id}>
          <div>
            {item.name && (
              <div className="text-sm font-medium text-gray-800">
                {item.name}
              </div>
            )}
            {item.role && (
              <div className="text-sm text-gray-600">{item.role}</div>
            )}
            <div className="text-sm text-gray-700 whitespace-pre-line mt-2">
              {item.content}
            </div>
          </div>
          <ListItemActions
            onEdit={() => handleOpenEdit(item)}
            onDelete={() => remove(item.id)}
          />
        </div>
      ))}

      <AboutForm
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
