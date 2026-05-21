import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import Playlist from "./components/Playlist";
import Filters from "./components/Filters";
import Button from "./components/Button.jsx";
import Sort from "./components/Sort.jsx";
import DarkModeButton from "./components/DarkModeButton.jsx";
import Footer from "./components/Footer.jsx";
import { PlaceholderFilters, PlaceholderPlaylist } from "./components/Placeholder.jsx";
import { useDebounce } from "use-debounce";
import ReactPlayer from "react-player";
import { clsx } from "clsx";
import BXLg from "./icons/BXLg.jsx";

const defaultSortDirection = {
  artist: 1,
  album: 1,
  genre: 1,
  year: -1,
  views: -1,
  likes: -1,
  published: -1,
};

const PLAYER = {
  STOP: 0,
  PAUSE: 1,
  PLAY: 2,
};

function App() {
  const [data, setData] = useState([]);
  const [playlistData, setPlaylistData] = useState();
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [activeFilters, setActiveFilters] = useState(() => ({
    genre: new Set(),
    country: new Set(),
    year: new Set(),
    published: new Set(),
  }));
  const [activeAnyFilter, setActiveAnyFilter] = useState();
  const [page, setPage] = useState(1);

  const [playerId, setPlayerId] = useState(null);
  const [playerState, setPlayerState] = useState(PLAYER.STOP);
  const [playerVolume, setPlayerVolume] = useState(0.5);
  const playerRef = useRef();

  const [sort, setSort] = useState("published");
  const [direction, setDirection] = useState(defaultSortDirection.published);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  function handleClickDarkMode() {
    setDarkMode(() => !darkMode);
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", false);
    }
  }, [darkMode]);

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
        setPlaylistData(data);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      });
  }, []);

  const [debouncedFilter] = useDebounce(filterTitle, 300);

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      let genreMatch;
      if (activeAnyFilter) {
        genreMatch = item.genre.includes(activeAnyFilter);
      } else {
        genreMatch = activeFilters.genre.size === 0 || activeFilters.genre.has(item.genre);
      }
      const countryMatch =
        activeFilters.country.size === 0 || activeFilters.country.has(item.country);
      const yearMatch = activeFilters.year.size === 0 || activeFilters.year.has(item.year);
      const filterTitleMatch = item.title.toLowerCase().includes(debouncedFilter.toLowerCase());
      return genreMatch && countryMatch && yearMatch && filterTitleMatch;
    });
  }, [
    data,
    activeFilters.genre,
    activeFilters.country,
    activeFilters.year,
    activeAnyFilter,
    debouncedFilter,
  ]);

  const sortedItems = useMemo(() => {
    const sortCallbacks = {
      artist: (a, b) => a.artist.localeCompare(b.artist),
      album: (a, b) => a.album.localeCompare(b.album),
      genre: (a, b) => {
        const slashesA = (a.genre.match(/\//g) || []).length;
        const slashesB = (b.genre.match(/\//g) || []).length;

        if (slashesA !== slashesB) {
          return slashesA - slashesB;
        }

        return a.genre.localeCompare(b.genre);
      },
      year: (a, b) => a.year - b.year,
      views: (a, b) => a.views - b.views,
      likes: (a, b) => a.likes - b.likes,
      published: (a, b) => new Date(a.published) - new Date(b.published),
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
    if (name.startsWith("Any ")) {
      setActiveFilters(() => {
        return {
          ...activeFilters,
          genre: new Set(),
        };
      });
      setActiveAnyFilter(() => {
        if (activeAnyFilter === name.substring(4)) {
          return null;
        }
        return name.substring(4);
      });
      return;
    }
    if (filter === "genre") {
      setActiveAnyFilter(() => null);
    }
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
    if (filter === "genre") {
      setActiveAnyFilter(null);
    }
    setActiveFilters(() => {
      let next = new Set();
      return {
        ...activeFilters,
        [filter]: next,
      };
    });
  }

  function handlePlaylistItemImageClick(item) {
    if (playerId === item.id) {
      setPlayerState(() =>
        playerState === PLAYER.PAUSE || playerState === PLAYER.STOP ? PLAYER.PLAY : PLAYER.PAUSE,
      );
      return;
    }
    setPlayerId(item.id);
    setPlayerState(PLAYER.PLAY);
  }

  function handleLoadPageClick() {
    setPage((prev) => prev + 1);
  }

  function handleLoadAllClick() {
    setPage(0);
  }

  function syncVolume() {
    if (playerRef.current) {
      setPlayerVolume(() => playerRef.current.volume);
    }
  }

  return (
    <>
      <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
        <div className="text-xl font-semibold">Metaltube</div>
        <DarkModeButton darkMode={darkMode} onClickDarkMode={handleClickDarkMode}></DarkModeButton>
      </nav>

      <div className="mx-auto mt-10 max-w-6xl">
        {loading ? (
          <>
            <PlaceholderFilters />
            <PlaceholderPlaylist />
          </>
        ) : (
          <>
            <Filters
              filters={filters}
              onFilterClick={handleFilterClick}
              activeFilters={activeFilters}
              activeAnyFilter={activeAnyFilter}
              filterTitle={filterTitle}
              onFilterTitleChange={setFilterTitle}
              onFilterClear={handleFilterClearClick}
            ></Filters>

            <div className="my-14"></div>

            <Sort
              sort={sort}
              setSort={setSort}
              direction={direction}
              setDirection={setDirection}
              defaultSortDirection={defaultSortDirection}
            ></Sort>
            <Playlist
              data={paginatedItems}
              playerId={playerId}
              playerState={playerState}
              onImageClick={handlePlaylistItemImageClick}
            ></Playlist>

            <div className="flex justify-center gap-x-4">
              {paginatedItems.length < filteredItems.length && (
                <>
                  <Button onClick={handleLoadPageClick}>Load more (50)</Button>
                  <Button onClick={handleLoadAllClick}>Load all ({sortedItems.length})</Button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mb-20"></div>

      <Footer updated={playlistData?.updated}></Footer>

      <div
        className={clsx("fixed right-4 bottom-4 block", playerState === PLAYER.STOP && "!hidden")}
      >
        <div className="mx-1 flex py-1">
          <button onClick={() => setPlayerState(0)} className="ml-auto">
            <BXLg className="h-5 w-5"></BXLg>
          </button>
        </div>
        <ReactPlayer
          ref={playerRef}
          src={`https://www.youtube.com/watch?v=${playerId}`}
          playing={playerState === PLAYER.PLAY}
          width="480px"
          height="270px"
          controls
          volume={playerVolume}
          onSeeking={syncVolume}
          onPlaying={() => {
            setPlayerState(PLAYER.PLAY);
            syncVolume();
          }}
          onPause={() => {
            if (playerState === PLAYER.STOP) return
            setPlayerState(PLAYER.PAUSE);
            syncVolume();
          }}
        />
      </div>
    </>
  );
}

export default App;
