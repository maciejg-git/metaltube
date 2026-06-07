import axios from "axios";
import fs from "fs"

const API_KEY = process.env.API_KEY
const PLAYLISTS = {
  BMP: "UUzCWehBejA23yEz3zp7jlcg",
  ABMA: "UUDLkzWN1rHY4eYkGnVruHVw",
  TDSA: "UUhmm356a5qe1luUsoatAgjA"
}
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const REFERER = process.env.REFERER

let currentPlaylist = "BMP"
// let currentPlaylist = "TDSA"
// let currentPlaylist = "ABMA"

function parseDescriptionBMP(description) {
  const index = description.indexOf('\n');
  const firstLine = index === -1 ? description : description.substring(0, index);

  return Object.fromEntries(
    firstLine.split('|').map(item => {
      const [key, value] = item.split(':').map(part => part.trim());
      return [key.toLowerCase(), value];
    })
  );
}

function parseDescriptionTDSA(description) {
  const firstFiveLines = description.split('\n').slice(0, 6).join('\n');

  return firstFiveLines.split('\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split(':');
    
    if (key && valueParts.length) {
      let k = key.trim().toLowerCase()
      let v
      if (k === "genre") {
        v = valueParts.join(':').split(",").map((i) => i.trim())
      } else {
        v = valueParts.join(':').trim().replaceAll(',', '/')
      }
      acc[k] = v
    }
    
    return acc;
  }, {});
}

function parseTitleBMP(str) {
  let [artist, album] = str.split("-").map((part) => part.trim())
  return { artist, album }
}

async function fetchPlaylistItems(nextPageToken) {
  let params = {
    part: 'snippet,contentDetails',
    maxResults: 50,
    playlistId: PLAYLISTS[currentPlaylist],
    key: API_KEY,
  }

  if (nextPageToken) {
    params.pageToken = nextPageToken
  }

  try {
    const response = await axios.get(BASE_URL + "/playlistItems", {
      params,
      headers: {
        'Referer': REFERER 
      }
    });

    const items = response.data.items;

    let optimizedItems = items.map((i) => {
      let {title, description, thumbnails } = i.snippet
      let {videoId, videoPublishedAt} = i.contentDetails

      let parsedDescription
      let parsedTitle

      if (currentPlaylist === "BMP") {
        parsedDescription = parseDescriptionBMP(description)
        parsedTitle = parseTitleBMP(title)
      }

      if (currentPlaylist === "ABMA") {
        parsedTitle = parseTitleBMP(title)
      }

      if (currentPlaylist === "TDSA") {
        parsedDescription = parseDescriptionTDSA(description)
        parsedTitle = parseTitleBMP(title)
      }

      return {
        title,
        // img: thumbnails.default.url.substring(0, thumbnails.default.url.lastIndexOf("/")),
        id: videoId,
        published: videoPublishedAt.substring(0, 10),
        ...parsedTitle,
        ...parsedDescription,
      }
    })

    return [optimizedItems, response.data.nextPageToken]
  } catch (error) {
    console.error('Error fetching playlist:', error.response ? error.response.data : error.message);
  }
}

async function fetchVideoData(videoId) {
  let params = {
    part: 'statistics',
    id: videoId,
    key: API_KEY,
  }

  try {
    const response = await axios.get(BASE_URL + "/videos", {
      params,
      headers: {
        'Referer': REFERER 
      }
    });

    const items = response.data.items;

    items.forEach((i) => delete i.statistics.favoriteCount)

    return items.reduce((acc, i) => {
      acc[i.id] = {
        ...i.statistics
      }
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching playlist:', error.response ? error.response.data : error.message);
  }
}

function sortWithSlashes(a, b) {
  const slashesA = (a.match(/\//g) || []).length;
  const slashesB = (b.match(/\//g) || []).length;

  if (slashesA !== slashesB) {
    return slashesA - slashesB;
  }

  return a.localeCompare(b);
}

function normalizeSlashes(str) {
  return str.replace(/\s*\/+\s*/g, " / ")
} 

function fixItems(items) {
  return items.map((i) => {
    if (i.artist === undefined) {
      i.artist = ""
    }
    if (i.album === undefined) {
      i.album = ""
    }
    if (i.country === undefined) {
      i.country = ""
    }
    if (i.genre === undefined) {
      i.genre = currentPlaylist === "TDSA" ? [] : ""
    }
    if (i.year === undefined) {
      i.year = ""
    }
    if (!Array.isArray(i.genre)) {
      i.genre = normalizeSlashes(i.genre)
    }
    return i
  })
}

function makeFilters(items) {
  let filters = {
    genre: new Set(),
    country: new Set(),
    year: new Set(),
    published: new Set(),
  }

  let anyGenreFilters = [
    "Atmospheric",
    "Folk",
    "Doom",
    "Death",
    "Cosmic",
    "Melodic",
    "Symphonic",
    "Acoustic",
    "Post",
    "Epic",
    "Progressive",
    "Ambient",
    "Melancholic",
    "Thrash",
    "Heavy",
    "Pagan",
    "Synth",
    "Raw",
  ].map((i) => `Any ${i}`). sort()

  items.forEach(i => {
    if (currentPlaylist === "TDSA") {
      i.genre && i.genre.forEach((genre) => {
        genre && filters.genre.add(genre.replaceAll('"', ''))
      })
    } else {
      i.genre && filters.genre.add(i.genre)
    }
    i.country && filters.country.add(i.country)
    i.year && filters.year.add(i.year)
    i.published && filters.published.add(i.published)
  });

  filters.genre = [...filters.genre].sort(sortWithSlashes)
  if (currentPlaylist === "BMP") {
    filters.genre = [...anyGenreFilters, ...filters.genre]
  }
  filters.country = [...filters.country].sort(sortWithSlashes)
  filters.year = [...filters.year].sort()
  filters.published = [...filters.published]

  return filters
}

async function fetchAll() {
  let optimizedItems
  let nextPageToken
  let allItems = []
  let counter = 0
  let uniqueArtists = new Set()

  while (true) {
    console.log("Fetching playlist " + counter);
    [optimizedItems, nextPageToken] = await fetchPlaylistItems(nextPageToken);
    let videoIds = optimizedItems.map((i) => i.id).join(",")
    let statistics = await fetchVideoData(videoIds)
    optimizedItems = fixItems(optimizedItems)
    optimizedItems = optimizedItems.map((i) => {
      let { viewCount: views, likeCount: likes } = statistics[i.id]
      return {
        ...i,
        views,
        likes,
      }
    })
    allItems.push(...optimizedItems)
    if (!nextPageToken) break
    counter++
  }

  console.log("Making filters");
  let filters = makeFilters(allItems)

  allItems.forEach((i) => {
    uniqueArtists.add(i.artist)
  })

  let dataDir = "./src/data/"

  try {
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-playlist.json`, JSON.stringify(allItems));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-filters.json`, JSON.stringify(filters));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-data.json`, JSON.stringify({updated: new Date().toISOString()}));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-artists.json`, JSON.stringify([...uniqueArtists]));
  } catch (err) {
    console.error(err);
  }
}

fetchAll()
