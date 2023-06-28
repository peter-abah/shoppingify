import React from "react";
type DataItem = {
  name: string;
  percent: number;
};
type Props = {
  title: string;
  data: DataItem[];
  ui?: {
    className?: string;
    itemColor?: string;
  };
};

function TopList({ data, title, ui }: Props) {
  const { className = "", itemColor = "#F9A109" } = ui || {};
  return (
    <section className={className + " w-[min(100%,20rem)] min-w-[12.5rem]"}>
      <header className="mb-9">
        <h2 className="text-2xl font-medium">{title}</h2>
      </header>
      <ol>
        {data.map(({ name, percent }) => (
          <li key={name} className="mb-7">
            <p className="flex justify-between items-center mb-3 gap-4 font-medium">
              <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {name}
              </span>
              <span className="text-lg shrink-0">{percent.toFixed(0)}%</span>
            </p>
            <div
              className="top-list_item relative bg-[#E0E0E0] rounded h-[6px] before:absolute 
                            before:h-full before:rounded before:bg-[]"
              style={{
                ["--percent" as any]: `${percent}%`,
                ["--item-color" as any]: itemColor,
              }}
            ></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
export default TopList;
