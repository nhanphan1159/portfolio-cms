import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type ContactItem = {
  id?: string;
  _id?: string;
  address?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
};

interface ContactFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: ContactItem;
  onFormChange: (updater: (s: ContactItem) => ContactItem) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ContactForm({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: ContactFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Contact" : "Create Contact"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="Email"
          type="email"
          value={form.email ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, email: val }))}
          placeholder="email@example.com"
        />
        <FormField
          label="Phone"
          type="tel"
          value={form.phone ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, phone: val }))}
          placeholder="+84 123 456 789"
        />
        <FormField
          label="Address"
          value={form.address ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, address: val }))}
          placeholder="Enter address"
          rows={3}
        />
        <FormField
          label="GitHub"
          type="url"
          value={form.github ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, github: val }))}
          placeholder="https://github.com/username"
          inputMode="url"
        />
        <FormField
          label="LinkedIn"
          type="url"
          value={form.linkedin ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, linkedin: val }))}
          placeholder="https://linkedin.com/in/username"
          inputMode="url"
        />

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
