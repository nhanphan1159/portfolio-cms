import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type ExperienceItem = {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  startAt: string;
  endAt: string;
  job: string;
};

interface ExperienceFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: ExperienceItem;
  onFormChange: (updater: (s: ExperienceItem) => ExperienceItem) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ExperienceForm({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: ExperienceFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Experience" : "Create Experience"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="Company"
          value={form.company}
          onChange={(val) => onFormChange((s) => ({ ...s, company: val }))}
          required
        />
        <FormField
          label="Role"
          value={form.role}
          onChange={(val) => onFormChange((s) => ({ ...s, role: val }))}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="From"
            value={form.startAt ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, startAt: val }))}
            placeholder="YYYY"
          />
          <FormField
            label="To"
            value={form.endAt ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, endAt: val }))}
            placeholder="YYYY"
          />
        </div>
        <FormField
          label="Description"
          value={form.job ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, job: val }))}
          placeholder="Enter job description"
          rows={5}
        />

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
