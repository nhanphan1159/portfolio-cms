import React, { useState } from "react";

import ProjectForm from "@/components/CMS/forms/ProjectForm";
import ListItemActions from "@/components/CMS/shared/ListItemActions";
import { useResourceManager } from "@/hooks/useResourceManager";

type PhotoItem = {
  url: string;
  caption?: string;
};

type ProjectItem = {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  url?: string;
  imgMain?: string;
  img?: PhotoItem[];
};

export default function ProjectManager() {
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

  const [preview, setPreview] = useState<{
    url: string;
    caption?: string;
    title?: string;
  } | null>(null);
  const [form, setForm] = useState<ProjectItem>({
    title: "",
    description: "",
    url: "",
    imgMain: "",
    img: [],
  });
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>([]);

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
    const source = item;
    setForm({
      title: source.title ?? "",
      description: source.description ?? "",
      url: source.url ?? "",
      imgMain: source.imgMain ?? "",
      img:
        source.img && source.img.length > 0
          ? source.img
          : [{ url: "", caption: "" }],
      id: source.id ?? source._id ?? item.id,
    });
    setGalleryPhotos(source.img ?? []);
    openEdit(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProjectItem = { ...form, img: galleryPhotos };
    await save(payload);
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

      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="text-sm text-gray-500">Chưa có dữ liệu</div>
      )}

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
              {it.img && it.img.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs uppercase text-gray-500">Gallery</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {it.img.map((p, idx) => (
                      <div key={idx} className="border rounded p-2 flex gap-2">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                          {p.url ? (
                            <img
                              src={p.url}
                              alt={p.caption ?? it.title}
                              className="w-full h-full object-cover cursor-zoom-in"
                              onClick={() =>
                                setPreview({
                                  url: p.url,
                                  caption: p.caption,
                                  title: it.title,
                                })
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium truncate">{p.url}</div>
                          <div className="text-gray-600">{p.caption}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:ml-4 shrink-0">
              <ListItemActions
                onEdit={() => handleOpenEdit(it)}
                onDelete={() => remove(it.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <ProjectForm
        isOpen={showForm}
        isEditing={!!editing}
        form={form}
        galleryPhotos={galleryPhotos}
        onFormChange={setForm}
        onGalleryChange={setGalleryPhotos}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

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
