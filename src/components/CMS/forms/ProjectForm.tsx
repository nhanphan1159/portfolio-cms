import React from "react";

import FormButtons from "@/components/CMS/shared/FormButtons";
import FormField from "@/components/CMS/shared/FormField";
import Modal from "@/components/CMS/shared/Modal";

type PhotoItem = string;

type ProjectItem = {
  id?: string;
  _id?: string;
  title: string;
  url?: string;
  imgMain?: string;
  img?: PhotoItem[];
  task?: string;
};

interface ProjectFormProps {
  isOpen: boolean;
  isEditing: boolean;
  form: ProjectItem;
  galleryPhotos: PhotoItem[];
  onFormChange: (updater: (s: ProjectItem) => ProjectItem) => void;
  onGalleryChange: (photos: PhotoItem[]) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProjectForm({
  isOpen,
  isEditing,
  form,
  galleryPhotos,
  onFormChange,
  onGalleryChange,
  onClose,
  onSubmit,
}: ProjectFormProps) {
  function updatePhoto(index: number, _key: "url" | "caption", value: string) {
    const nextPhotos = [...galleryPhotos];
    nextPhotos[index] = value;
    onGalleryChange(nextPhotos);
  }

  function addPhotoRow() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newPhotos: string[] = [];
        let loadedCount = 0;
        const totalFiles = files.length;

        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPhotos.push(reader.result as string);
            loadedCount++;
            if (loadedCount === totalFiles) {
              onGalleryChange([...galleryPhotos, ...newPhotos]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  }

  function removePhotoRow(index: number) {
    const nextPhotos = [...galleryPhotos];
    nextPhotos.splice(index, 1);
    onGalleryChange(nextPhotos);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Project" : "Create Project"}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          label="Title"
          value={form.title}
          onChange={(val) => onFormChange((s) => ({ ...s, title: val }))}
          required
        />
        <FormField
          label="Task"
          value={form.task ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, task: val }))}
          rows={3}
        />
        <FormField
          label="URL"
          type="url"
          value={form.url ?? ""}
          onChange={(val) => onFormChange((s) => ({ ...s, url: val }))}
          placeholder="https://example.com"
          inputMode="url"
        />
        <div>
          <label className="block text-sm font-medium mb-1">
            Main Photo URL
          </label>
          <input
            type="text"
            value={form.imgMain ?? ""}
            onChange={(e) =>
              onFormChange((s) => ({ ...s, imgMain: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            placeholder="Enter image URL or choose file below"
          />
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              Or choose an image file
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onFormChange((s) => ({
                      ...s,
                      imgMain: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          {form.imgMain && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Preview:</div>
              <img
                src={form.imgMain}
                alt="Preview"
                className="w-full max-w-xs rounded border object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Gallery Photos</label>
            <button
              type="button"
              onClick={addPhotoRow}
              className="px-2 py-1 text-sm border rounded bg-blue-50 hover:bg-blue-100"
            >
              Add Photo
            </button>
          </div>
          {galleryPhotos.length > 0 && (
            <div className="space-y-3">
              {galleryPhotos.map((p, idx) => (
                <div key={idx} className="border rounded p-3 space-y-2">
                  <div className="flex gap-3">
                    <img
                      src={p}
                      alt={`Photo ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        value={p ?? ""}
                        onChange={(e) =>
                          updatePhoto(idx, "caption", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                        placeholder="Add caption (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => removePhotoRow(idx)}
                        className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <FormButtons onCancel={onClose} />
        </div>
      </form>
    </Modal>
  );
}
