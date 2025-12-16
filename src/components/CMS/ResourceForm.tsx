import React from "react";

type Field = { key: string; label: string; type?: string };

type Props = {
  initial?: Record<string, unknown>;
  fields: Field[];
  onCancel?: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
};

export default function ResourceForm({
  initial = {},
  fields,
  onCancel,
  onSubmit,
}: Props) {
  const [state, setState] = React.useState<Record<string, unknown>>(() => ({
    ...initial,
  }));

  function set(key: string, value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(state);
      }}
      className="space-y-3 p-4"
    >
      {fields.map((f) => (
        <div key={String(f.key)}>
          <label className="block text-sm font-medium mb-1">{f.label}</label>
          <input
            value={String(state[String(f.key)] ?? "")}
            onChange={(e) => set(String(f.key), e.target.value)}
            type={f.type ?? "text"}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      ))}

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
