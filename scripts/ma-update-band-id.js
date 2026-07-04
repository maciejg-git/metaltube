import { Impit } from 'impit';
import * as cheerio from 'cheerio';
import fs from "fs"
import isoCountries from "i18n-iso-countries"

import bandsBmp from "../src/data/bmp-bands-with-country.json" with { type: "json" }
import bandsAbma from "../src/data/abma-bands-with-country.json" with { type: "json" }

import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" }
import bandsDataMulti from "../src/data-metal-archives/bands-data-multi.json" with { type: "json" }

let bands = {...bandsBmp, ...bandsAbma}

let bandsCount = Object.keys(bands).length

const impit = new Impit({
    browser: "chrome", // or "firefox"
    ignoreTlsErrors: true,
});

const maSearchUrl = "https://www.metal-archives.com/search/ajax-advanced/searching/bands/"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let updateBandsData = {}
let updateBandsDataMulti = {}
let counter = 0

for (let band in bands) {
  if (bandsData[band]) continue

  let country = bands[band].country.split("/").map((i) => i.trim())

  for (let i of country) {
    let isoCountry = isoCountries.getAlpha2Code(i, "en") ?? ""

    const maSearchParams = new URLSearchParams("?bandName=&country=&exactBandMatch=1")
    maSearchParams.set("bandName", band)
    maSearchParams.set("country", isoCountry)

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
      } else {
        id = "multi"
        updateBandsDataMulti[band] = {
          id,
          genre,
          country: isoCountry,
        }
      }

      updateBandsData[band] = {
        id,
        genre,
        country: isoCountry,
      }
    } else {
      updateBandsData[band] = {
        id,
      }
    }

    console.log(counter, bandsCount, band, isoCountry)

    await delay(3000)

    if (data.aaData.length) break
  }

  counter++
  if (counter > 1000) break
}

let dataDir = "./src/data-metal-archives/"

fs.writeFileSync(`${dataDir}bands-data.json`, JSON.stringify({...bandsData, ...updateBandsData}));
fs.writeFileSync(`${dataDir}bands-data-multi.json`, JSON.stringify({...bandsDataMulti, ...updateBandsDataMulti}));
