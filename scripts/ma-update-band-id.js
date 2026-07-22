import { Impit } from 'impit';
import * as cheerio from 'cheerio';
import fs from "fs"
import isoCountries from "i18n-iso-countries"

import bandsBmp from "../src/data/bmp-bands-with-country.json" with { type: "json" }

import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" }
import bandsDataNoId from "../src/data-metal-archives/bands-data-no-id.json" with { type: "json" }
import bandsDataMultiId from "../src/data-metal-archives/bands-data-multi-id.json" with { type: "json" }

let bands = {...bandsBmp}

let bandsCount = Object.keys(bands).length

let specialIsoCodes = {
  "International": "XX",
  "Unknown": "ZZ",
}

const impit = new Impit({
    browser: "chrome", // or "firefox"
    ignoreTlsErrors: true,
});

const maSearchUrl = "https://www.metal-archives.com/search/ajax-advanced/searching/bands/"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let updateBandsData = {}
let updateBandsDataNoId = {}
let updateBandsDataMultiId = {}

let counter = 0

for (let band in bands) {
  let fixedParams = {}

  if (bandsData[band]) continue
  if (bandsDataMultiId[band]) continue
  if (bandsDataNoId[band]) {
    fixedParams = bandsDataNoId[band].fixedParams
    if (!fixedParams) continue
  }

  let country = bands[band].country.split("/").map((i) => i.trim())
  if (country.length > 1) country.push("International")
  if (fixedParams.country) {
    country = [fixedParams.country]
  }

  for (let i of country) {
    let isoCountry
    if (specialIsoCodes[i]) {
      isoCountry = specialIsoCodes[i]
    } else {
      isoCountry = isoCountries.getAlpha2Code(i, "en") ?? ""
    }

    const maSearchParams = new URLSearchParams("?bandName=&exactBandMatch=1&genre=&country=&yearCreationFrom=&yearCreationTo=&bandNotes=&status=&themes=&location=")
    maSearchParams.set("bandName", fixedParams.name ?? band)
    maSearchParams.set("country", isoCountry)
    maSearchParams.set("exactBandMatch", fixedParams.exactBandMatch ?? 1)

    const response = await impit.fetch(`${maSearchUrl}?${maSearchParams.toString()}`);

    let data = await response.json()

    let id = ""
    let genre = ""

    if (data.aaData && data.aaData.length) {
      if (data.aaData.length === 1) {
        const $ = cheerio.load(data.aaData[0][0]);
        let link = $("a").attr("href")
        id = link.split("/").pop()
        genre = data.aaData[0][1]

        updateBandsData[band] = {
          id,
          genre,
          country: isoCountry,
        }
      } else {
        updateBandsDataMultiId[band] = {
          id: "multi",
          genre,
          country: isoCountry || i,
        }
      }
    }

    console.log(counter, bandsCount, band, isoCountry)

    await delay(3000)

    if (data.aaData.length) break
  }

  if (!updateBandsData[band] && !updateBandsDataMultiId[band]) {
    if (!bandsDataNoId[band]) {
      updateBandsDataNoId[band] = {
        id: "",
        genre: "",
        country: bands[band].country,
      }
    }
  }

  counter++
  if (counter > 1000) break
}

let updatedBandsData = {...bandsData, ...updateBandsData}
let updatedBandsDataNoId = {...bandsDataNoId, ...updateBandsDataNoId}
let updatedBandsDataMultiId = {...bandsDataMultiId, ...updateBandsDataMultiId}

for (let band in updatedBandsDataMultiId) {
  if (!updatedBandsData[band] && bandsDataMultiId[band].id !== "multi") {
    updatedBandsData[band] = {
      id: bandsDataMultiId[band].id,
      genre: bandsDataMultiId[band].genre,
      country: bandsDataMultiId[band].country,
    }
    console.log(band + " ID updated")
  }
}

let dataDir = "./src/data-metal-archives/"

fs.writeFileSync(`${dataDir}bands-data.json`, JSON.stringify(updatedBandsData, null, 2));
fs.writeFileSync(`${dataDir}bands-data-no-id.json`, JSON.stringify(updatedBandsDataNoId, null, 2));
fs.writeFileSync(`${dataDir}bands-data-multi-id.json`, JSON.stringify(updatedBandsDataMultiId, null, 2));
