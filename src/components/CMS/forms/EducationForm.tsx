import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

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

interface EducationFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: EducationItem;
  onFormChange: (updater: (s: EducationItem) => EducationItem) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EducationForm({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: EducationFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Education" : "Create Education"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="School"
          value={form.school}
          onChange={(val) => onFormChange((s) => ({ ...s, school: val }))}
          required
          placeholder="University"
        />
        <FormField
          label="Degree"
          value={form.degree}
          onChange={(val) => onFormChange((s) => ({ ...s, degree: val }))}
          required
          placeholder="Bachelor of Science in Computer Science"
        />
        <FormField
          label="GPA"
          value={form.GPA ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, GPA: val }))}
          placeholder="4.0"
        />
        <FormField
          label="Description"
          value={form.description ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, description: val }))}
          placeholder="Additional details about your education"
          rows={4}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="Start Year"
            value={form.startAt ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, startAt: val }))}
            placeholder="YYYY"
          />
          <FormField
            label="End Year"
            value={form.endAt ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, endAt: val }))}
            placeholder="YYYY"
          />
        </div>

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
