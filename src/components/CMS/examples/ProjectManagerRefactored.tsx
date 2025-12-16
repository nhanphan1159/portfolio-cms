import React, { useState } from "react";

import type { PhotoItem } from "@/components/CMS/shared/GalleryManager";
import GalleryManager from "@/components/CMS/shared/GalleryManager";
import ImageUploader from "@/components/CMS/shared/ImageUploader";
import LoadingError from "@/components/CMS/shared/LoadingError";
import Modal from "@/components/CMS/shared/Modal";
import { useResourceManager } from "@/hooks/useResourceManager";

type ProjectItem = {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  url?: string;
  imgMain?: string;
  img?: string[];
};

export default function ProjectManagerRefactored() {
  const {
    items,
    loading,
    error,
    editing,
    showForm,
    setShowForm,
    openCreate,
    openEdit,
    save,
    remove,
  } = useResourceManager<ProjectItem>("projects");

  const [form, setForm] = useState<ProjectItem>({
    title: "",
    description: "",
    url: "",
    imgMain: "",
    img: [],
  });

  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>([]);
  const [preview, setPreview] = useState<{
    url: string;
    caption?: string;
    title?: string;
  } | null>(null);

  const handleOpenCreate = () => {
    setForm({
      title: "",
      description: "",
      url: "",
      imgMain: "",
      img: [],
    });
    setGalleryPhotos([]);
    openCreate();
  };

  const handleOpenEdit = (item: ProjectItem) => {
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      url: item.url ?? "",
      imgMain: item.imgMain ?? "",
      img: item.img ?? [],
      id: item.id ?? item._id,
    });
    setGalleryPhotos([]);
    openEdit(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save(form);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button
          onClick={handleOpenCreate}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Create
        </button>
      </div>

      <LoadingError loading={loading} error={error} itemsCount={items.length} />

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id ?? JSON.stringify(it)}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between border rounded p-3 gap-3"
          >
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-lg">{it.title}</div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {it.description}
              </div>
              {it.url && (
                <a
                  className="text-sm text-blue-600"
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {it.url}
                </a>
              )}
              {it.imgMain && (
                <div className="mt-2">
                  <div className="text-xs uppercase text-gray-500 mb-1">
                    Main photo
                  </div>
                  <img
                    src={it.imgMain}
                    alt={it.title}
                    className="w-full max-w-sm rounded border object-cover cursor-zoom-in"
                    onClick={() =>
                      setPreview({
                        url: it.imgMain!,
                        caption: "Main photo",
                        title: it.title,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 lg:ml-4 shrink-0">
              <button
                onClick={() => handleOpenEdit(it)}
                className="px-2 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(it.id)}
                className="px-2 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Project" : "Create Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((s) => ({ ...s, title: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              value={form.url ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <ImageUploader
            value={form.imgMain ?? ""}
            onChange={(value) => setForm((s) => ({ ...s, imgMain: value }))}
            label="Main Photo"
          />

          <GalleryManager
            photos={galleryPhotos}
            onPhotosChange={setGalleryPhotos}
          />

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
      </Modal>

      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative bg-white rounded shadow-lg max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 px-2 py-1 border rounded bg-white"
              onClick={() => setPreview(null)}
            >
              ✕
            </button>
            <div className="p-4 space-y-2">
              {preview.title && (
                <div className="font-semibold text-lg">{preview.title}</div>
              )}
              {preview.caption && (
                <div className="text-sm text-gray-600">{preview.caption}</div>
              )}
              <div className="w-full">
                <img
                  src={preview.url}
                  alt={preview.caption ?? preview.title ?? "Preview"}
                  className="w-full max-h-[70vh] object-contain rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
