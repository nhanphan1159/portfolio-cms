import { type FC } from "react";

interface PropsType {
  value?: string;
  label?: string;
}

const ItemDetail: FC<PropsType> = ({ value, label }) => {
  return value && label ? (
    <div className="flex gap-3 items-center justify-start">
      {label && (
        <label className="text-xs text-gray-500 min-w-[3.875rem]">
          {label}
        </label>
      )}
      {value && <div className="text-sm text-gray-700">{value}</div>}
    </div>
  ) : null;
};

export default ItemDetail;
