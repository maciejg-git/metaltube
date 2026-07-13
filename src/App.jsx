import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import Playlist from "./components/Playlist";
import Filters from "./components/Filters";
import Button from "./components/Button.jsx";
import Sort from "./components/Sort.jsx";
import Footer from "./components/Footer.jsx";
import { PlaceholderFilters, PlaceholderPlaylist } from "./components/Placeholder.jsx";
import { useDebounce } from "use-debounce";
import { defaultSortDirection, genreMap, PLAYER } from "./config.js";
import Player from "./components/Player.jsx";
import Navbar from "./components/Navbar.jsx";
import { useDarkMode } from "./hooks/useDarkMode.js";
import LayoutControl from "./components/LayoutControl.jsx";
import CoverLayout from "./components/CoverLayout.jsx";

async function fetchPlaylist(channel) {
  let [playlist, filters, data] = await Promise.all(
    ["playlist", "filters", "data"].map((i) => {
      return import(`./data/${channel}-${i}.json`);
    }),
  );
  let genre = filters.default.genre;
  let country = filters.default.country;
  let year = filters.default.year;
  let items = playlist.default;

  let playlistItems = [];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    playlistItems.push({
      title: item[2] && item[3] ? item[2] + " - " + item[3] : item[2] || item[3] || "",
      id: item[0],
      published: item[1],
      band: item[2],
      album: item[3],
      country: item[4],
      year: item[5],
      genre: typeof item[6] === "number" ? genreMap[item[6]] : item[6],
      views: item[7],
      likes: item[8],
      reviews: item[9],
      rating: item[10],
    });
  }

  if (channel === "tdsa") {
    playlistItems = playlistItems.map((i) => {
      i.displayGenre = i.genre.join(" / ");
      return i;
    });
  }

  return { genre, country, year, playlistItems, data };
}

async function fetchBands() {
  let bands = await Promise.all(
    ["bmp", "tdsa"].map((i) => {
      return import(`./data/${i}-bands.json`);
    }),
  );
  return ["bmp", "tdsa"].map((channel, index) => ({ channel, items: bands[index].default }));
}

function App() {
  const [data, setData] = useState([]);
  const [playlistData, setPlaylistData] = useState();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("bmp");

  const [filters, setFilters] = useState([]);
  const [filterString, setFilterString] = useState("");
  const [filterInputBy, setFilterInputBy] = useState({band: true, album: false});
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

  const [sort, setSort] = useState("published");
  const [direction, setDirection] = useState(defaultSortDirection.published);
  const [randomSort, setRandomSort] = useState(0);

  const [layout, setLayout] = useState(localStorage.getItem("layout") ?? "normal");
  const [prevLayout, setPrevLayout] = useState("normal");

  const [bands, setBands] = useState([]);

  const [darkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    const getBands = async () => {
      try {
        let bands = await fetchBands();
        setBands(bands);
      } catch (error) {
        console.log(error);
      }
    };

    getBands();
  }, []);

  useEffect(() => {
    setLoading(true);

    const getPlaylist = async () => {
      try {
        let { genre, country, year, playlistItems, data } = await fetchPlaylist(current);

        setData(playlistItems);
        setFilters({ genre, country, year });
        setPlaylistData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    getPlaylist();
  }, [current]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const [debouncedFilter] = useDebounce(filterString, 300);

  const filterCallbacks = {
    bmp: (item) => {
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

      const bandMatch = filterInputBy.band && item.band.toLowerCase().includes(debouncedFilter.toLowerCase());

      const albumMatch = filterInputBy.album && item.album.toLowerCase().includes(debouncedFilter.toLowerCase());

      return genreMatch && countryMatch && yearMatch && (bandMatch || albumMatch);
    },
    tdsa: (item) => {
      let genreMatch =
        activeFilters.genre.size === 0 || item.genre.some((i) => activeFilters.genre.has(i));

      const countryMatch =
        activeFilters.country.size === 0 || activeFilters.country.has(item.country);

      const yearMatch = activeFilters.year.size === 0 || activeFilters.year.has(item.year);

      const filterTitleMatch = item.title.toLowerCase().includes(debouncedFilter.toLowerCase());

      const bandMatch = filterInputBy.band && item.band.toLowerCase().includes(debouncedFilter.toLowerCase());

      const albumMatch = filterInputBy.album && item.album.toLowerCase().includes(debouncedFilter.toLowerCase());

      return genreMatch && countryMatch && yearMatch && (bandMatch || albumMatch);
    },
    abma: (item) => {
      const filterTitleMatch = item.title.toLowerCase().includes(debouncedFilter.toLowerCase());

      return filterTitleMatch;
    },
  };

  const filteredItems = useMemo(() => {
    let activeFn = filterCallbacks[current];
    return data.filter(activeFn);
  }, [
    current,
    data,
    activeFilters.genre,
    activeFilters.country,
    activeFilters.year,
    activeAnyFilter,
    debouncedFilter,
    filterInputBy,
  ]);

  const sortedItems = useMemo(() => {
    if (sort === "random") {
      return shuffleArray([...filteredItems]);
    }
    const sortCallbacks = {
      band: (a, b) => a.band.localeCompare(b.band),
      album: (a, b) => a.album.localeCompare(b.album),
      genre: (a, b) => {
        let genreA = a.displayGenre ?? a.genre;
        let genreB = b.displayGenre ?? b.genre;
        const slashesA = (genreA.match(/\//g) || []).length;
        const slashesB = (genreB.match(/\//g) || []).length;

        if (slashesA !== slashesB) {
          return slashesA - slashesB;
        }

        return genreA.localeCompare(genreB);
      },
      year: (a, b) => a.year - b.year,
      views: (a, b) => a.views - b.views,
      likes: (a, b) => a.likes - b.likes,
      rating: (a, b, direction) => {
        if (a.reviews === 0 && b.reviews === 0) {
          return 0
        }
        if (a.reviews === 0) return 1 * direction;
        if (b.reviews === 0) return -1 * direction;
        if (a.rating === b.rating) {
          return (a.reviews - b.reviews);
        }
        return a.rating - b.rating;
      },
      reviews: (a, b, direction) => {
        if (a.reviews === 0 && b.reviews === 0) {
          return 0
        }
        if (a.reviews === 0) return 1 * direction;
        if (b.reviews === 0) return -1 * direction;
        if (a.reviews === b.reviews) {
          return (a.rating - b.rating);
        }
        return a.reviews - b.reviews;
      },
      published: (a, b) => new Date(a.published) - new Date(b.published),
    };

    const sortCallback = sortCallbacks[sort];

    if (!sortCallback) return filteredItems;

    return [...filteredItems].sort((a, b) => sortCallback(a, b, direction) * direction);
  }, [filteredItems, sort, direction, randomSort]);

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

  function handleBandAutocompleteItemClick(i) {
    setFilterString(i.name);
    setCurrent(i.channel);
    setPage(1);
    setFilterInputBy({band: true, album: false})
  }

  function handleChannelClick(channel) {
    setCurrent(channel);
    setPage(1);
    setFilterString("");
  }

  function handleLayoutButtonClick(nextLayout) {
    setPrevLayout(layout);
    setLayout(nextLayout);
    if (nextLayout !== "cover") {
      localStorage.setItem("layout", nextLayout)
    }
  }

  function handleLoadPageClick() {
    setPage((prev) => prev + 1);
  }

  function handleLoadAllClick() {
    setPage(0);
  }

  return (
    <>
      <Navbar
        darkMode={darkMode}
        onClickDarkMode={toggleDarkMode}
        current={current}
        onChannelClick={handleChannelClick}
        bands={bands}
        onClickItem={(i) => handleBandAutocompleteItemClick(i)}
      ></Navbar>

      <div className="mx-auto mt-10 max-w-7xl px-4 xl:px-0">
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
              filterString={filterString}
              onFilterTitleChange={setFilterString}
              onFilterClear={handleFilterClearClick}
              current={current}
              filterInputBy={filterInputBy}
              setFilterInputBy={setFilterInputBy}
            ></Filters>

            <div className="my-14"></div>

            <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-6">
              <LayoutControl
                layout={layout}
                onLayoutButtonClick={handleLayoutButtonClick}
              ></LayoutControl>
              <Sort
                sort={sort}
                setSort={setSort}
                direction={direction}
                setDirection={setDirection}
                defaultSortDirection={defaultSortDirection}
                setRandomSort={setRandomSort}
                current={current}
              ></Sort>
            </div>

            <div className="my-2"></div>

            <Playlist
              data={paginatedItems}
              playerId={playerId}
              playerState={playerState}
              onImageClick={handlePlaylistItemImageClick}
              layout={layout}
            ></Playlist>

            <div className="my-10"></div>

            <div className="flex justify-center gap-x-4">
              {paginatedItems.length < filteredItems.length && (
                <>
                  <Button onClick={handleLoadPageClick} className="!rounded-full">
                    Load more (50)
                  </Button>
                  <Button onClick={handleLoadAllClick} className="!rounded-full">
                    Load all ({sortedItems.length})
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="my-20"></div>

      <Footer updated={playlistData?.updated}></Footer>

      {layout === "cover" && (
        <CoverLayout
          data={paginatedItems}
          playerId={playerId}
          playerState={playerState}
          onImageClick={handlePlaylistItemImageClick}
          onCloseButtonClick={() => setLayout(prevLayout)}
          onLoadMoreClick={handleLoadPageClick}
          displayPageButton={paginatedItems.length < filteredItems.length}
        ></CoverLayout>
      )}

      <Player
        playerId={playerId}
        playerState={playerState}
        setPlayerState={setPlayerState}
      ></Player>
    </>
  );
}

export default App;
