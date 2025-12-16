import Button from "@/components/CMS/shared/Button";

interface FormButtonsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export default function FormButtons({
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: FormButtonsProps) {
  return (
    <div className="flex gap-2 justify-end pt-2">
      <Button variant="secondary" label={cancelLabel} onClick={onCancel} />
      <Button type="submit" variant="primary" label={submitLabel} />
    </div>
  );
}
