export type PhotoItem = {
  url: string;
  caption?: string;
};

type GalleryManagerProps = {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  buttonLabel?: string;
};

export default function GalleryManager({
  photos,
  onPhotosChange,
  buttonLabel = "Add photo",
}: GalleryManagerProps) {
  const handleAddPhotos = () => {
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
            onPhotosChange([
              ...photos,
              { url: reader.result as string, caption: "" },
            ]);
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const updatePhoto = (
    index: number,
    key: "url" | "caption",
    value: string
  ) => {
    const nextPhotos = [...photos];
    nextPhotos[index] = { ...nextPhotos[index], [key]: value };
    onPhotosChange(nextPhotos);
  };

  const removePhoto = (index: number) => {
    const nextPhotos = [...photos];
    nextPhotos.splice(index, 1);
    onPhotosChange(nextPhotos);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Gallery photos</label>
        <button
          type="button"
          onClick={handleAddPhotos}
          className="px-2 py-1 text-sm border rounded bg-blue-50 hover:bg-blue-100"
        >
          {buttonLabel}
        </button>
      </div>
      {photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((p, idx) => (
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
                    onClick={() => removePhoto(idx)}
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
  );
}
