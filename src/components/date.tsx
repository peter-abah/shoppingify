import dayjs from "dayjs";
import { MdEventNote } from "react-icons/md";

type Props = {
  date: string;
};

function DateComponent({ date }: Props) {
  const formattedDate = dayjs(date).format("ddd D.M.YYYY");
  return (
    <div className="flex items-center text-[#C1C1C4]">
      <MdEventNote className="text-xl" />
      <span className="ml-3 text-xs">{formattedDate}</span>
    </div>
  );
}

export default DateComponent;
