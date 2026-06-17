import { useState } from "react";
import clsx from "clsx";
import Input from "./Input.jsx";
import FaChevronDownSolid from "../icons/FaChevronDownSolid.jsx";
import { channels } from "../config.js";

const Filters = ({
  filters,
  onFilterClick,
  activeFilters,
  activeAnyFilter,
  filterTitle,
  onFilterTitleChange,
  onFilterClear,
  current,
}) => {
  let [genreShowAll, setGenreShowAll] = useState(false);
  let [countryShowAll, setCountryShowAll] = useState(false);
  let [yearShowAll, setYearShowAll] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-y-7">

      {channels[current].filters.has("genre") &&
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {activeAnyFilter
                ? `Genre (1)`
                : activeFilters.genre.size > 0
                  ? `Genre (${activeFilters.genre.size})`
                  : "Genre"}
            </div>
            <div className="flex divide-x divide-gray-300 dark:divide-gray-500">
              <FilterClearButton onClick={() => onFilterClear("genre")}></FilterClearButton>
              <FilterShowAllButton
                show={genreShowAll}
                onClick={() => setGenreShowAll(!genreShowAll)}
              ></FilterShowAllButton>
            </div>
          </div>
          <FilterRow>
            {filters.genre?.slice(0, genreShowAll ? filters.genre.length : 20).map((name) => {
              return (
                <FilterButton
                  key={name}
                  name={name}
                  filter="genre"
                  onFilterClick={onFilterClick}
                  active={`Any ${activeAnyFilter}` === name || activeFilters.genre.has(name)}
                ></FilterButton>
              );
            })}
          </FilterRow>
        </div>
      }

      {channels[current].filters.has("country") &&
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {activeFilters.country.size > 0 ? `Country (${activeFilters.country.size})` : "Country"}
            </div>
            <div className="flex divide-x divide-gray-300 dark:divide-gray-500">
              <FilterClearButton onClick={() => onFilterClear("country")}></FilterClearButton>
              <FilterShowAllButton
                show={countryShowAll}
                onClick={() => setCountryShowAll(!countryShowAll)}
              ></FilterShowAllButton>
            </div>
          </div>
          <FilterRow>
            {filters.country?.slice(0, countryShowAll ? filters.country.length : 10).map((name) => {
              return (
                <FilterButton
                  key={name}
                  name={name}
                  filter="country"
                  onFilterClick={onFilterClick}
                  active={activeFilters.country.has(name)}
                ></FilterButton>
              );
            })}
          </FilterRow>
        </div>
      }

      {channels[current].filters.has("year") &&
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {activeFilters.year.size > 0 ? `Year (${activeFilters.year.size})` : "Year"}
            </div>
            <div className="flex divide-x divide-gray-300 dark:divide-gray-500">
              <FilterClearButton onClick={() => onFilterClear("year")}></FilterClearButton>
              <FilterShowAllButton
                show={yearShowAll}
                onClick={() => setYearShowAll(!yearShowAll)}
              ></FilterShowAllButton>
            </div>
          </div>
          <FilterRow>
            {filters.year?.slice(0, yearShowAll ? filters.year.length : 10).map((name) => {
              return (
                <FilterButton
                  key={name}
                  name={name}
                  filter="year"
                  onFilterClick={onFilterClick}
                  active={activeFilters.year.has(name)}
                ></FilterButton>
              );
            })}
          </FilterRow>
        </div>
      }

        <div className="text-lg font-semibold">Band and album</div>
        <Input
          type="search"
          value={filterTitle}
          onChange={(e) => onFilterTitleChange(e.target.value)}
        ></Input>
      </div>
    </>
  );
};

const FilterRow = ({ children }) => {
  return <div className="flex flex-wrap items-center gap-x-2 md:gap-x-6 gap-y-2 rounded-lg">{children}</div>;
};

const FilterButton = ({ filter, name, onFilterClick, active }) => {
  return (
    <button
      className={clsx(
        "rounded-full bg-gray-100 px-3 py-2 text-sm transition-colors transition-shadow hover:bg-gray-50 dark:bg-neutral-800 hover:dark:bg-neutral-700",
        active && "font-semibold ring-2 ring-gray-400 dark:text-white dark:!ring-neutral-400",
      )}
      onClick={() => onFilterClick(filter, name)}
    >
      {name}
    </button>
  );
};

const FilterClearButton = ({ onClick }) => {
  return (
    <button
      className="flex items-center gap-x-1 pr-3 font-semibold hover:text-gray-500 hover:dark:text-white"
      onClick={onClick}
    >
      Clear
    </button>
  );
};

const FilterShowAllButton = ({ show, onClick }) => {
  return (
    <button
      className="flex items-center gap-x-1 pl-3 font-semibold hover:text-gray-500 hover:dark:text-white"
      onClick={onClick}
    >
      {show ? "Hide" : "Show all"}
      <FaChevronDownSolid
        className={"h-4 w-4 transition duration-200 " + (show && "rotate-180")}
      ></FaChevronDownSolid>
    </button>
  );
};

export default Filters;
