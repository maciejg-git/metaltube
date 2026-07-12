import clsx from "clsx";

export default function FilterInput({
  className,
  type,
  value,
  onChange,
  filterInputBy,
  setFilterInputBy,
}) {
  const handleFilterInputButtonClick = (name) => {
    if (name === "band") {
      setFilterInputBy({ band: true, album: false });
    } else if (name === "album") {
      setFilterInputBy({ band: false, album: true });
    }
  };

  return (
    <div
      className={
        "flex flex-1 items-center rounded-full bg-gray-100 py-2 pr-3 pl-5 outline-hidden transition-shadow duration-200 focus-within:ring-3 focus-within:ring-violet-200 focus:outline-hidden dark:bg-neutral-700 dark:text-gray-300 dark:focus-within:ring-violet-300 " +
        className
      }
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border-none bg-transparent p-0 outline-none mr-4"
      />
      <div className="flex gap-x-2">
        <FilterInputButton
          label="Band"
          active={filterInputBy.band}
          onClick={() => handleFilterInputButtonClick("band")}
        ></FilterInputButton>
        <FilterInputButton
          label="Album"
          active={filterInputBy.album}
          onClick={() => handleFilterInputButtonClick("album")}
        ></FilterInputButton>
      </div>
    </div>
  );
}

const FilterInputButton = ({ label, active, direction, sort, onClick }) => {
  return (
    <button
      className={clsx(
        "flex items-center gap-x-2 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors transition-shadow",
        active
          ? "bg-violet-300 hover:bg-violet-200 dark:bg-violet-400 dark:text-gray-800 hover:dark:bg-violet-300"
          : "bg-gray-200 hover:bg-gray-50 dark:bg-neutral-800 hover:dark:bg-neutral-600",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
