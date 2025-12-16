import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type SkillItem = {
  id?: string;
  _id?: string;
  name: string;
  level?: string;
};

interface SkillFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: SkillItem;
  onFormChange: (updater: (s: SkillItem) => SkillItem) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SkillForm({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: SkillFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Skill" : "Create Skill"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="Name"
          value={form.name}
          onChange={(val) => onFormChange((s) => ({ ...s, name: val }))}
          required
        />
        <FormField
          label="Level"
          value={form.level ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, level: val }))}
          placeholder="e.g. Advanced"
        />

        <FormButtons onCancel={onClose} />
      </form>
    </Modal>
  );
}
