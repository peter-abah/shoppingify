import { MdSearch } from "react-icons/md";

export default function Header() {
  return (
    <header className="my-8 md:mt-9 md:mb-14 flex flex-wrap justify-between gap-4">
      <h1 className="text-[26px] md:text-xl xl:text-[26px] max-w-md font-bold">
        <span className="text-[#F9A109]">Shoppingify </span>
        <span className="hidden md:inline">allows you take your shopping list wherever you go</span>
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
