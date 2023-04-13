import { MdSearch } from "react-icons/md";

export default function Header() {
  return (
    <header className="mt-9 mb-14 flex justify-between">
      <h1 className="text-[26px] max-w-md font-bold">
        <span className="text-[#F9A109]">Shoppingify</span> allows you take your
        shopping list wherever you go
      </h1>

      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search item
        </label>
        <input
          className="rounded-lg py-4 pl-16 pr-5 bg-white text-sm placeholder:text-slate-700"
          type="text"
          placeholder="search item"
          id="search"
          autoComplete="shopping"
        />
        <MdSearch className="absolute top-4 bottom-4 left-5 text-lg" />
      </div>
    </header>
  );
}
