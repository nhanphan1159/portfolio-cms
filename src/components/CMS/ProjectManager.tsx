import React, { useCallback, useEffect, useState } from "react";

import httpClient from "@/services/httpClient";
import { toList } from "@/utils/api";

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

const endpoint = "projects"; // API đang dùng số nhiều theo route cũ

export default function ProjectManager() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get(endpoint).json<unknown>();
      const list = toList<ProjectItem>(res).map((it) => ({
        ...it,
        id: it.id ?? it._id,
      }));
      setItems(list);
    } catch (err) {
      setError("Không lấy được dữ liệu projects từ API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      url: "",
      imgMain: "",
      img: [],
    });
    setShowForm(true);
  }

  function openEdit(item: ProjectItem) {
    // Không có API get detail, lấy dữ liệu ngay từ list theo id
    const fromList = item.id
      ? items.find((it) => it.id === item.id)
      : undefined;
    const source = fromList ?? item;
    setEditing(source);
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
    setShowForm(true);
  }

  function updatePhoto(index: number, key: "url" | "caption", value: string) {
    setGalleryPhotos((prev) => {
      const nextPhotos = [...prev];
      nextPhotos[index] = { ...nextPhotos[index], [key]: value };
      return nextPhotos;
    });
  }

  function addPhotoRow() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setGalleryPhotos((prev) => [
              ...prev,
              { url: reader.result as string, caption: "" },
            ]);
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  }

  function removePhotoRow(index: number) {
    setGalleryPhotos((prev) => {
      const nextPhotos = [...prev];
      nextPhotos.splice(index, 1);
      return nextPhotos;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing?.id) {
        await httpClient
          .patch(`${endpoint}/${editing.id}`, { json: form })
          .json();
      } else {
        await httpClient.post(endpoint, { json: form }).json();
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError("Lưu project thất bại");
      console.error(err);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xoá mục này?")) return;
    try {
      await httpClient.delete(`${endpoint}/${id}`).json();
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError("Xoá thất bại");
      console.error(err);
    }
  }
  console.log(form.imgMain);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="flex gap-2">
          <label className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Add Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm((s) => ({
                      ...s,
                      imgMain: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          <button
            onClick={openCreate}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {form.imgMain && !showForm && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium">Selected Photo Preview</div>
            <button
              onClick={() => setForm((s) => ({ ...s, imgMain: "" }))}
              className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
          <img
            src={form.imgMain}
            alt="Preview"
            className="w-full max-w-md rounded border object-cover"
          />
        </div>
      )}

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
                    {/* {it.img.map((p, idx) => (
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
                    ))} */}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 lg:ml-4 shrink-0">
              <button
                onClick={() => openEdit(it)}
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

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded shadow w-full max-w-lg h-[80vh] overflow-y-auto ">
            <div className="border-b p-3 flex justify-between items-center">
              <div className="font-semibold">
                {editing ? "Edit" : "Create"} project
              </div>
              <button className="px-2" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={save} className="space-y-3 p-4">
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
                <label className="block text-sm font-medium mb-1">
                  Main photo URL
                </label>
                <input
                  type="text"
                  value={form.imgMain ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, imgMain: e.target.value }))
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
                          setForm((s) => ({
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
                  <label className="text-sm font-medium">Gallery photos</label>
                  <button
                    type="button"
                    onClick={addPhotoRow}
                    className="px-2 py-1 text-sm border rounded bg-blue-50 hover:bg-blue-100"
                  >
                    Add photo
                  </button>
                </div>
                {galleryPhotos.length > 0 && (
                  <div className="space-y-3">
                    {galleryPhotos.map((p, idx) => (
                      <div key={idx} className="border rounded p-3 space-y-2">
                        <div className="flex gap-3">
                          <img
                            src={p.url}
                            alt={p.caption ?? `Photo ${idx + 1}`}
                            className="w-32 h-32 object-cover rounded border"
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              value={p.caption ?? ""}
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
          </div>
        </div>
      )}

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
