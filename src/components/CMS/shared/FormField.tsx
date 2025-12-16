interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  rows,
  inputMode,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={rows}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
        />
      )}
    </div>
  );
}
