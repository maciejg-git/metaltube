const defaultSortDirection = {
  artist: 1,
  album: 1,
  genre: 1,
  year: -1,
  views: -1,
  likes: -1,
  published: -1,
};

const sortOptions = [
  { name: "artist", label: "Artist" },
  { name: "album", label: "Album" },
  { name: "genre", label: "Genre" },
  { name: "year", label: "Year" },
  { name: "views", label: "Views" },
  { name: "likes", label: "Likes" },
  { name: "published", label: "Publish date" },
];

const defaultPlayerOptions = {
  position: "bottom",
  volume: 0.5,
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
  PLAYER
}
