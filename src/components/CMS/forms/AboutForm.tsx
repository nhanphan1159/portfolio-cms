import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type AboutItem = {
  id?: string;
  _id?: string;
  content: string;
  name: string;
  role: string;
};

interface AboutFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: AboutItem;
  onFormChange: (updater: (s: AboutItem) => AboutItem) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AboutForm({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: AboutFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit About" : "Create About"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="Content"
          value={form.content}
          onChange={(val) => onFormChange((s) => ({ ...s, content: val }))}
          placeholder="Enter your bio or description"
          rows={4}
          required
        />
        <FormField
          label="Name"
          value={form.name ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, name: val }))}
        />
        <FormField
          label="Role"
          value={form.role ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, role: val }))}
        />

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
