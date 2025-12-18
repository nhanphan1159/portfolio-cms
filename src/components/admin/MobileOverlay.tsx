interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-gray-100/30 bg-opacity-50 z-30"
      onClick={onClose}
    />
  );
}
