import React, { useState } from "react";

import ContactForm from "@/components/CMS/forms/ContactForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import LoadingError from "@/components/CMS/shared/LoadingError";
import { useResourceManager } from "@/hooks/useResourceManager";

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
  } = useResourceManager<ContactItem>("contact");

  const [form, setForm] = useState<ContactItem>({
    address: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const items = allItems.length > 0 ? allItems[0] : null;

  const handleOpenCreate = () => {
    setForm({ address: "", email: "", phone: "", linkedin: "", github: "" });
    openCreate();
  };

  const handleOpenEdit = (item: ContactItem) => {
    setForm({
      address: item.address ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      linkedin: item.linkedin ?? "",
      github: item.github ?? "",
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
        <h2 className="text-lg font-semibold">Contact</h2>
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
          <ListItemActions
            onEdit={() => handleOpenEdit(items)}
            onDelete={() => remove(items.id)}
          />
        </div>
      )}

      <ContactForm
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
