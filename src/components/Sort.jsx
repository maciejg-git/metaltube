import FaChevronDownSolid from "../icons/FaChevronDownSolid";
import clsx from "clsx";

const sortOptions = [
  { name: "artist", label: "Artist" },
  { name: "album", label: "Album" },
  { name: "genre", label: "Genre" },
  { name: "year", label: "Year" },
  { name: "views", label: "Views" },
  { name: "likes", label: "Likes" },
  { name: "published", label: "Publish date" },
];

const Sort = ({ sort, setSort, direction, setDirection, defaultSortDirection }) => {
  function handleSortButtonClick(name) {
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
        <SortButton
          key={name}
          label={label}
          active={sort === name}
          direction={direction}
          onClick={() => handleSortButtonClick(name)}
        ></SortButton>
      ))}
    </div>
  );
};

const SortButton = ({ label, active, direction, onClick }) => {
  return (
    <button
      className={clsx(
        "flex items-center gap-x-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm shadow-md transition-colors transition-shadow dark:border-neutral-700 dark:bg-neutral-800",
        active &&
          "border-gray-400 font-semibold ring-2 ring-gray-400 dark:!border-neutral-400 dark:text-white dark:!ring-neutral-400",
      )}
      onClick={onClick}
    >
      {label}
      {active && (
        <FaChevronDownSolid
          className={"h-4 w-4 transition duration-200 " + (direction === 1 && "rotate-180")}
        ></FaChevronDownSolid>
      )}
    </button>
  );
};

export default Sort;
