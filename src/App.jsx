import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Playlist from "./components/Playlist";
import Filters from "./components/Filters";
import Button from "./components/Button.jsx";
import Sort from "./components/Sort.jsx";
import DarkModeButton from "./components/DarkModeButton.jsx";
import Footer from "./components/Footer.jsx"
import { PlaceholderFilters, PlaceholderPlaylist } from "./components/Placeholder.jsx";
import { useDebounce } from "use-debounce";

const defaultSortDirection = {
  artist: 1,
  album: 1,
  year: -1,
  views: -1,
  likes: -1,
  publishedAt: -1,
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [activeFilters, setActiveFilters] = useState(() => ({
    genre: new Set(),
    country: new Set(),
    year: new Set(),
    publishedAt: new Set(),
  }));
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("publishedAt");
  const [direction, setDirection] = useState(defaultSortDirection.publishedAt);
  const [filterTitle, setFilterTitle] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  });
  const [playlistData, setPlaylistData] = useState()

  function handleClickDarkMode() {
    setDarkMode(() => !darkMode);
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", true)
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", false)
    }
  }, [darkMode])

  useEffect(() => {
    setLoading(true);

    Promise.all([
      import("./data/bmp-playlist.json"),
      import("./data/bmp-filters.json"),
      import("./data/bmp-data.json"),
    ])
      .then(([playlist, filters, data]) => {
        let genre = filters.default.genre;
        let country = filters.default.country;
        let year = filters.default.year;
        setData(playlist.default);
        setFilters({ genre, country, year });
        setPlaylistData(data)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 600)
      });
  }, []);

  const [debouncedFilter] = useDebounce(filterTitle, 300);

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const genreMatch =
        activeFilters.genre.size === 0 || activeFilters.genre.has(item.genre);
      const countryMatch =
        activeFilters.country.size === 0 ||
        activeFilters.country.has(item.country);
      const yearMatch =
        activeFilters.year.size === 0 || activeFilters.year.has(item.year);
      const filterTitleMatch = item.title
        .toLowerCase()
        .includes(debouncedFilter.toLowerCase());
      return genreMatch && countryMatch && yearMatch && filterTitleMatch;
    });
  }, [
    data,
    activeFilters.genre,
    activeFilters.country,
    activeFilters.year,
    debouncedFilter,
  ]);

  const sortedItems = useMemo(() => {
    const sortCallbacks = {
      artist: (a, b) => a.artist.localeCompare(b.artist),
      album: (a, b) => a.album.localeCompare(b.album),
      year: (a, b) => a.year - b.year,
      views: (a, b) => a.views - b.views,
      likes: (a, b) => a.likes - b.likes,
      publishedAt: (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
    };

    const sortCallback = sortCallbacks[sort];

    if (!sortCallback) return filteredItems;

    return [...filteredItems].sort((a, b) => sortCallback(a, b) * direction);
  }, [filteredItems, sort, direction]);

  const paginatedItems = useMemo(() => {
    return page === 0 ? sortedItems : sortedItems.slice(0, 50 * page);
  }, [page, sortedItems]);

  function handleFilterClick(filter, name) {
    setPage(1);
    setActiveFilters((prev) => {
      let next = new Set(prev[filter]);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return {
        ...activeFilters,
        [filter]: next,
      };
    });
  }

  function handleFilterClearClick(filter) {
    setPage(1);
    setActiveFilters(() => {
      let next = new Set();
      return {
        ...activeFilters,
        [filter]: next,
      };
    });
  }

  function handleLoadPageClick() {
    setPage((prev) => prev + 1);
  }

  function handleLoadAllClick() {
    setPage(0);
  }

  return (
    <>
      <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
        <div className="text-xl font-semibold">Metaltube</div>
        <DarkModeButton
          darkMode={darkMode}
          onClickDarkMode={handleClickDarkMode}
        ></DarkModeButton>
      </nav>
      <div className="mx-auto mt-10 max-w-6xl">
        {loading ? (
          <>
            <PlaceholderFilters></PlaceholderFilters>
            <PlaceholderPlaylist></PlaceholderPlaylist>
          </>
        ) : (
          <>
            <Filters
              filters={filters}
              onFilterClick={handleFilterClick}
              activeFilters={activeFilters}
              filterTitle={filterTitle}
              onFilterTitleChange={setFilterTitle}
              onFilterClear={handleFilterClearClick}
            ></Filters>
            <div className="my-14"></div>
            <Sort sort={sort} setSort={setSort} direction={direction} setDirection={setDirection} defaultSortDirection={defaultSortDirection}></Sort>
            <Playlist data={paginatedItems}></Playlist>
            <div className="flex justify-center gap-x-4">
              {paginatedItems.length < filteredItems.length && (
                <>
                  <Button onClick={handleLoadPageClick}>Load more (50)</Button>
                  <Button onClick={handleLoadAllClick}>
                    Load all ({sortedItems.length})
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <div className="mb-20"></div>
      <Footer updated={playlistData?.updated}></Footer>
    </>
  );
}

export default App;
