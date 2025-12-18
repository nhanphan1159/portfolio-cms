import React, { useState } from "react";

import ContactForm from "@/components/CMS/forms/ContactForm";
import ItemDetail from "@/components/CMS/shared/ItemDetail";
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
  } = useResourceManager<ContactItem>("contact");

  const [form, setForm] = useState<ContactItem>({
    address: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const item = items.length > 0 ? items[0] : null;

  const handleOpenCreate = () => {
    setForm({ address: "", email: "", phone: "", linkedin: "", github: "" });
    openCreate();
  };

  const handleOpenEdit = (data: ContactItem) => {
    setForm({
      address: data.address ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      linkedin: data.linkedin ?? "",
      github: data.github ?? "",
      id: data.id,
    });
    openEdit(data);
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

      <LoadingError loading={loading} error={error} itemsCount={item ? 1 : 0} />

      {item && (
        <div className="space-y-2 border rounded p-3">
          <div className="flex-1">
            <ItemDetail label="Email" value={item.email} />
            <ItemDetail label="Phone" value={item.phone} />
            <ItemDetail label="Address" value={item.address} />
            <ItemDetail label="LinkedIn" value={item.linkedin} />
            <ItemDetail label="GitHub" value={item.github} />
          </div>
          <ListItemActions
            onEdit={() => handleOpenEdit(item)}
            onDelete={() => remove(item.id)}
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
