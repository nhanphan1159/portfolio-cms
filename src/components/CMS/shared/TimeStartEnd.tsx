import type { FC } from "react";

interface PropsType {
  start?: string;
  end?: string;
}

const TimeStartEnd: FC<PropsType> = ({ start, end }) => {
  return (
    <div className="flex text-xs text-gray-500 gap-3">
      <span>Start - End</span>
      <div className="text-xs text-gray-500">
        {start} - {end}
      </div>
    </div>
  );
};

export default TimeStartEnd;
