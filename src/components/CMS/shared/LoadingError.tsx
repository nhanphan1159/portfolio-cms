type LoadingErrorProps = {
  loading: boolean;
  error: string | null;
  itemsCount: number;
  emptyMessage?: string;
};

export default function LoadingError({
  loading,
  error,
  itemsCount,
  emptyMessage = "Chưa có dữ liệu",
}: LoadingErrorProps) {
  return (
    <>
      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && itemsCount === 0 && (
        <div className="text-sm text-gray-500">{emptyMessage}</div>
      )}
    </>
  );
}
