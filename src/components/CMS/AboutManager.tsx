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
    items: allItems,
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

  const items = allItems.length > 0 ? allItems[0] : null;

  const handleOpenCreate = () => {
    setForm({ content: "", name: "", role: "" });
    openCreate();
  };

  const handleOpenEdit = (item: AboutItem) => {
    setForm({
      content: item.content ?? "",
      id: item.id,
      name: item.name ?? "",
      role: item.role ?? "",
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
          <ListItemActions
            onEdit={() => handleOpenEdit(items)}
            onDelete={() => remove(items.id)}
          />
        </div>
      )}

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
