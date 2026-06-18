import FaChevronDownSolid from "../icons/FaChevronDownSolid";
import clsx from "clsx";
import { sortOptions, channels } from "../config";

const Sort = ({ sort, setSort, direction, setDirection, defaultSortDirection, setRandomSort, current }) => {
  function handleSortButtonClick(name) {
    if (name === "random") {
      setSort(name)
      setRandomSort((prev) => prev + 1)
      return
    }
    if (name === sort) {
      setDirection(-direction);
      return;
    }
    setSort(name);
    setDirection(defaultSortDirection[name]);
  }

  return (
    <div className="flex items-center justify-end gap-x-4">
      <span className="font-semibold">Sort by</span>
      {sortOptions.map(({ name, label }) => (
        channels[current].sort.has(name) &&
        <SortButton
          key={name}
          label={label}
          active={sort === name}
          direction={direction}
          sort={sort}
          onClick={() => handleSortButtonClick(name)}
        ></SortButton>
      ))}
    </div>
  );
};

const SortButton = ({ label, active, direction, sort, onClick }) => {
  return (
    <button
      className={clsx(
        "flex items-center gap-x-2 rounded-full bg-gray-100 px-3 py-2 text-sm transition-colors transition-shadow dark:bg-neutral-800 hover:bg-gray-50 hover:dark:bg-neutral-700 whitespace-nowrap",
        active &&
          "font-semibold ring-2 ring-gray-400 dark:text-white dark:!ring-neutral-400",
      )}
      onClick={onClick}
    >
      {label}
      {active && sort !== "random" && (
        <FaChevronDownSolid
          className={"h-4 w-4 transition duration-200 " + (direction === 1 && "rotate-180")}
        ></FaChevronDownSolid>
      )}
    </button>
  );
};

export default Sort;
