import { monthToNumberMap, numberToMonthMap } from "@/lib/helpers";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { name: string; items: number }[];
};
function MonthChart({ data }: Props) {
  if (data.length < 3) {
    return null;
  }

  const sorted = padAndSortData(data);
  return (
    <section className="py-8">
      <h2 className="text-2xl mb-10 font-medium">Monthly Summary</h2>
      <ResponsiveContainer width="100%" aspect={2.54} className="text-sm">
        <LineChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="items" stroke="#8884d8" />
          <XAxis dataKey="name" axisLine={true} />
          <YAxis dataKey="items" />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

// Sorts data and pad or trims the data to return the specified length
function padAndSortData(data: Props["data"], padTo = 7) {
  let result = [...data];
  result.sort(
    (a, b) =>
      (monthToNumberMap.get(b.name) || 0) - (monthToNumberMap.get(a.name) || 0)
  );
  result = result.slice(-padTo);

  if (result.length === 7) return result;

  const extraData = [];
  const firstMonth = monthToNumberMap.get(result[0]?.name) || padTo;
  for (let i = 0; i < padTo - result.length + 1; i++) {
    let month = (((firstMonth - padTo + i) % 12) + 12) % 12;
    extraData.push({ name: numberToMonthMap.get(month), items: 0 });
  }
  return extraData.concat(result);
}

export default MonthChart;
