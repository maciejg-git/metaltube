import axios from "axios";
import fs from "fs"
import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" }
import bandsDiscography from "../src/data-metal-archives/bands-data-discography.json" with { type: "json" }
import similarBands from "../src/data-metal-archives/bands-data-similar.json" with {type: "json"}
import fixes from "./youtube-fetch-fixes.js"

const API_KEY = process.env.API_KEY
const PLAYLISTS = {
  BMP: "UUzCWehBejA23yEz3zp7jlcg",
  TDSA: "UUhmm356a5qe1luUsoatAgjA",
}
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const REFERER = process.env.REFERER

let currentPlaylist = "BMP"
// let currentPlaylist = "TDSA"

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

genreMap = Object.fromEntries(Object.entries(genreMap).map((i) => {
  return [i[1], parseInt(i[0])]
}))

const discography = Object.fromEntries(
  Object.entries(bandsDiscography).map(([key, value]) => [key.toLowerCase(), value])
);

let getAlbumType = (albumName) => {
  const dateRegex = /\d{2}\/\d{2}\/\d{4}/;

  const typeMatch = albumName.match(/\(([^)]+)\)[^()]*$/);
  const textToSearch = (typeMatch ? typeMatch[1] : albumName).toLowerCase();

  if (textToSearch.includes('music video') || textToSearch.includes('video')) {
    return 'Video';
  }
  if (textToSearch.includes('full album') || textToSearch.includes('album')) {
    return 'Full-length';
  }
  if (textToSearch.includes('ep')) {
    return 'EP';
  }
  if (textToSearch.includes('single') || textToSearch.includes('track')) {
    return 'Single';
  }
  if (textToSearch.includes('full demo') || textToSearch.includes('demo')) {
    return 'Demo';
  }
  if (textToSearch.includes('full split') || textToSearch.includes('split')) {
    return 'Split';
  }
  if (textToSearch.includes('live') || dateRegex.test(textToSearch)) {
    return 'Live album';
  }

  return 'Unknown';
}

let normalizeAlbum = (album) => {
  return album
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

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

function parseDescriptionBMP(description) {
  const index = description.indexOf('\n');
  const firstLine = index === -1 ? description : description.substring(0, index);

  return Object.fromEntries(
    firstLine.split('|').reduce((acc, item) => {
      const [key, value] = item.split(':').map(part => part.trim());
      if (value === undefined) return acc
      acc.push([key.toLowerCase(), value])
      return acc
    }, [])
  );
}

function parseDescriptionTDSA(description) {
  const firstFiveLines = description.split('\n').slice(0, 6).join('\n');

  const validDescriptionWords = ["Artist", "Album", "Year", "Genre"];
    
  let valid = validDescriptionWords.every(word => {
    const regex = new RegExp(word, 'i'); 
    return regex.test(firstFiveLines);
  });

  if (!valid) return null

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
  let [band, ...rest] = str.split(" - ")
  let album = rest.join(" - ").trim();

  band = band.trim()

  band = band.includes(" / ") 
    ? band.split(" / ") 
    : band;

  // if (album) {
  //   const regexp = /\s*\((?!.*live)[^)]+\)$/i;
  //   album = album.replace(regexp, "")
  // }

  return { band, album }
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
      let {title, description, thumbnails, videoOwnerChannelTitle } = i.snippet
      let {videoId, videoPublishedAt} = i.contentDetails

      let parsedDescription
      let parsedTitle

      if (fixes.title[title]) {
        title = fixes.title[title]
      }

      if (currentPlaylist === "BMP") {
        parsedDescription = parseDescriptionBMP(description)
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
        band: "",
        album: "",
        genre: currentPlaylist === "TDSA" ? [] : "",
        country: "",
        year: "",
        hasSimilarBands: 0,
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

function fixItems(items) {
  return items.map((i) => {
    if (!Array.isArray(i.genre)) {
      i.genre = normalizeSlashes(i.genre)
    }

    if (fixes.band[i.band]) {
      i.band = fixes.band[i.band]
    }
    if (fixes.country[i.country]) {
      i.country = fixes.country[i.country]
    }
    if (fixes.genre[i.genre]) {
      i.genre = fixes.genre[i.genre]
    }
    if (fixes.year[i.year]) {
      i.year = fixes.year[i.year]
    }

    if (!Array.isArray(i.band)) {
      i.band = i.band.split("|")[0].trim()
      i.band = i.band.replaceAll('\u200B', '');
    } else {
      i.band = i.band.map((band) => {
        return band.replaceAll('\u200B', '')
      })
    }

    i.album = i.album.replaceAll('\u200B', '');

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
  let uniqueBands = new Set()
  let uniqueBandsWithCountry = {}

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
        views: parseInt(views),
        likes: parseInt(likes),
      }
    })

    allItems.push(...optimizedItems)

    if (!nextPageToken) break

    counter++
  }

  console.log("Making filters");
  let filters = makeFilters(allItems)

  allItems.forEach((i) => {
    if (genreMap[i.genre]) {
      i.genre = genreMap[i.genre]
    }
  })

  // allItems.forEach((i) => {
  //   if (Array.isArray(i.band)) {
  //     i.band.forEach((band) => {
  //       uniqueBands.add(band)
  //       if (!uniqueBandsWithCountry[band]) {
  //         uniqueBandsWithCountry[band] = {
  //           country: i.country,
  //           isSplit: true,
  //         }
  //       }
  //     })
  //   }
  // })
  //
  // allItems.forEach((i) => {
  //   if (Array.isArray(i.band)) {
  //     return
  //   }
  //   uniqueBands.add(i.band)
  //   if (!uniqueBandsWithCountry[i.band] || uniqueBandsWithCountry[i.band].isSplit) {
  //     uniqueBandsWithCountry[i.band] = {
  //       country: i.country
  //     }
  //   }
  // })

  allItems.forEach((i) => {
    uniqueBands.add(i.band)
    if (!uniqueBandsWithCountry[i.band]) {
      uniqueBandsWithCountry[i.band] = {
        country: i.country
      }
    }
  })

  allItems = allItems.map((i) => {
    let { id, published, band, album, country, year, genre, views, likes } = i;

    let reviews = 0;
    let rating = 0;

    let type = getAlbumType(album);

    if (["Single", "Video", "Live album"].includes(type)) {
      return {
        ...i,
        reviews,
        rating,
      }
    }

    const parsedAlbum = album.replace(/\s*\([^)]*\)(?=[^)]*$)/, "");
    const lowerCaseBand = Array.isArray(band) ? band.map((i) => i.trim().toLowerCase()).find((i) => discography[i]) : band.trim().toLowerCase();

    if (currentPlaylist === "BMP") {
      if (discography[lowerCaseBand]) {
        let translation = parsedAlbum.includes(" | ") 
          ? parsedAlbum.split(" | ") 
          : [];

        translation = translation.map((i) => normalizeAlbum(i))

        let matchingAlbums = discography[lowerCaseBand].filter((i) => {
          let normalizedAlbum = normalizeAlbum(parsedAlbum)
          let normalizedDiscographyAlbum = normalizeAlbum(i.album)

          let match = normalizedDiscographyAlbum === normalizedAlbum
          let translatedMatch = translation.some((translatedAlbum) => {
            return normalizedDiscographyAlbum === translatedAlbum
          })
          let matchStart = normalizedDiscographyAlbum.startsWith(normalizedAlbum)
          let matchEnd = normalizedDiscographyAlbum.endsWith(normalizedAlbum)

          return match || translatedMatch || matchStart || matchEnd
        })

        let albumInDiscography =
          matchingAlbums.find((i) => {
            return i.type === type;
          }) ||
          matchingAlbums.find((i) => {
            return i.reviews;
          });

        if (albumInDiscography) {
          reviews = albumInDiscography.reviews;
          rating = albumInDiscography.rating;
        }
      }
    }

    return {
      id,
      published,
      band,
      album,
      country,
      year,
      genre,
      views,
      likes,
      reviews,
      rating,
    };
  });

  allItems = allItems.map((i) => {
    let hasSimilarBands = 0;

    if (similarBands[i.band] && similarBands[i.band].length) {
      hasSimilarBands = 1;
    }

    return {
      ...i,
      hasSimilarBands,
    }
  });

  allItems = allItems.map((i) => {
    let { id, published, band, album, country, year, genre, views, likes, reviews, rating, hasSimilarBands } = i;

    return [
      id,
      published,
      band,
      album,
      country,
      year,
      genre,
      views,
      likes,
      reviews,
      rating,
      hasSimilarBands,
    ];
  });

  // allItems = [...allItems, ...mtPlaylist]
  // filters.genre = [...filters.genre, ...mtFilters.genre]
  // filters.country = [...filters.country, ...mtFilters.country]
  // filters.year = [...filters.year, ...mtFilters.year]
  // filters.published = [...filters.published, ...mtFilters.published]

  let dataDir = "./src/data/"

  try {
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-playlist.json`, JSON.stringify(allItems));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-filters.json`, JSON.stringify(filters));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-data.json`, JSON.stringify({updated: new Date().toISOString(), count: allItems.length}));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-bands.json`, JSON.stringify([...uniqueBands]));
    fs.writeFileSync(`${dataDir}${currentPlaylist.toLowerCase()}-bands-with-country.json`, JSON.stringify(uniqueBandsWithCountry));
  } catch (err) {
    console.error(err);
  }
}

fetchAll()
