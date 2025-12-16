import Button from "@/components/CMS/shared/Button";

interface ListItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function ListItemActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ListItemActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" label={editLabel} onClick={onEdit} />
      <Button variant="danger" label={deleteLabel} onClick={onDelete} />
    </div>
  );
}
