import React from "react";

type ImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewClassName?: string;
};

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "Enter image URL or choose file below",
  showPreview = true,
  previewClassName = "w-full max-w-xs rounded border object-cover",
}: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1"
        placeholder={placeholder}
      />
      <div className="mt-2">
        <label className="block text-sm font-medium mb-1">
          Or choose an image file
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      {showPreview && value && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Preview:</div>
          <img src={value} alt="Preview" className={previewClassName} />
        </div>
      )}
    </div>
  );
}
