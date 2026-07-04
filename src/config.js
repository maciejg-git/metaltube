const defaultSortDirection = {
  band: 1,
  album: 1,
  genre: 1,
  year: -1,
  rating: -1,
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
  { name: "rating", label: "Rating" },
  { name: "views", label: "Views" },
  { name: "likes", label: "Likes" },
  { name: "published", label: "Publish date" },
];

const defaultPlayerOptions = {
  position: "bottom",
  volume: 0.5,
}

let genreMap = {
  1: "Black Metal",
  2: "Atmospheric Black Metal",
  3: "Melodic Black Metal",
  4: "Black / Death Metal",
  5: "Pagan Black Metal",
  6: "Atmospheric / Melancholic Black Metal",
  7: "Atmospheric / Depressive Black Metal",
  8: "Atmospheric Post-Black Metal",
  9: "Death / Black Metal",
  10: "Symphonic Black Metal",
  11: "Folk / Black Metal",
  12: "Depressive Black Metal",
  13: "Epic / Atmospheric Black Metal",
  14: "Melodic Death / Black Metal",
  15: "Progressive Black Metal",
}

const channels = {
  bmp: {
    name: "Black Metal Promotion",
    sort: new Set(["band", "album", "genre", "year", "random", "views", "likes", "rating", "published"]),
    filters: new Set(["genre", "country", "year", "title"]),
    img: "https://yt3.googleusercontent.com/ytc/AIdro_kjUgTst6YXNAsQ4XCyhoovZqMUq9QV_IPmv9_Jjj_8buo=s160-c-k-c0x00ffffff-no-rj",
    metalArchives: true,
  },
  tdsa: {
    name: "The Dungeon Synth Archives",
    sort: new Set(["band", "album", "genre", "year", "random", "views", "likes", "published"]),
    filters: new Set(["genre", "country", "year", "title"]),
    img: "https://yt3.googleusercontent.com/ytc/AIdro_ksTlOjFZKaby1OlxxMFmVwSh1_T70rK_mBv0IIiZfZbpE=s160-c-k-c0x00ffffff-no-rj",
    metalArchives: true,
  },
  abma: {
    name: "Atmospheric Black Metal Albums",
    sort: new Set(["band", "album", "random", "views", "likes", "published"]),
    filters: new Set(["title"]),
    img: "https://yt3.googleusercontent.com/ytc/AIdro_kzkdFTmrPoY1WKW-RBubg1gvKsRhTbwiD-JKNzQNqJoQ=s160-c-k-c0x00ffffff-no-rj",
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
  genreMap,
  PLAYER
}
