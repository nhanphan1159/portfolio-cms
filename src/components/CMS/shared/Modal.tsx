import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  maxHeight?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  maxHeight = "h-[80vh]",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-90">
      <div
        className={`bg-white rounded shadow w-full ${maxWidth} ${maxHeight} overflow-y-auto`}
      >
        <div className="border-b p-3 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="font-semibold">{title}</div>
          <button
            className="px-2 hover:bg-gray-100 rounded"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
