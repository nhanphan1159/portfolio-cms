import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type EducationItem = {
  id?: string;
  _id?: string;
  school: string;
  degree: string;
  from?: string;
  to?: string;
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
        />
        <FormField
          label="Degree"
          value={form.degree}
          onChange={(val) => onFormChange((s) => ({ ...s, degree: val }))}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="From"
            value={form.from ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, from: val }))}
            placeholder="YYYY"
          />
          <FormField
            label="To"
            value={form.to ?? ""}
            onChange={(val) => onFormChange((s) => ({ ...s, to: val }))}
            placeholder="YYYY"
          />
        </div>

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
