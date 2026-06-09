const defaultSortDirection = {
  band: 1,
  album: 1,
  genre: 1,
  year: -1,
  views: -1,
  likes: -1,
  published: -1,
};

const sortOptions = [
  { name: "band", label: "Band" },
  { name: "album", label: "Album" },
  { name: "genre", label: "Genre" },
  { name: "year", label: "Year" },
  { name: "random", label: "Random" },
  { name: "views", label: "Views" },
  { name: "likes", label: "Likes" },
  { name: "published", label: "Publish date" },
];

const defaultPlayerOptions = {
  position: "bottom",
  volume: 0.5,
}

const channels = {
  bmp: {
    name: "Black Metal Promotion",
    supportedSort: ["band", "album", "genre", "year", "views", "likes", "publish"],
    supportedFilters: ["genre", "country", "year", "title"],
    img: "https://yt3.googleusercontent.com/ytc/AIdro_kjUgTst6YXNAsQ4XCyhoovZqMUq9QV_IPmv9_Jjj_8buo=s160-c-k-c0x00ffffff-no-rj",
    metalArchives: true,
  },
  tdsa: {
    name: "The Dungeon Synth Archives",
    supportedSort: ["band", "album", "genre", "year", "views", "likes", "publish"],
    supportedFilters: ["genre", "country", "year", "title"],
    img: "https://yt3.googleusercontent.com/ytc/AIdro_ksTlOjFZKaby1OlxxMFmVwSh1_T70rK_mBv0IIiZfZbpE=s160-c-k-c0x00ffffff-no-rj",
    metalArchives: true,
  },
  abma: {
    name: "Atmospheric Black Metal Albums",
    supportedSort: ["band", "album", "genre", "year", "views", "likes", "publish"],
    supportedFilters: ["genre", "country", "year", "title"],
    img: "https://yt3.googleusercontent.com/ytc/AIdro_kjUgTst6YXNAsQ4XCyhoovZqMUq9QV_IPmv9_Jjj_8buo=s160-c-k-c0x00ffffff-no-rj",
    metalArchives: true,
  },
}

const PLAYER = {
  STOP: 0,
  PAUSE: 1,
  PLAY: 2,
};

export {
  defaultSortDirection,
  sortOptions,
  defaultPlayerOptions,
  channels,
  PLAYER
}
