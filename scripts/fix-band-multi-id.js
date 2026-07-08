import { Impit } from 'impit';
import * as cheerio from 'cheerio';
import fs from "fs"
import isoCountries from "i18n-iso-countries"

import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" }
import bandsDataMulti from "../src/data-metal-archives/bands-data-multi.json" with { type: "json" }

const impit = new Impit({
    browser: "chrome", // or "firefox"
    ignoreTlsErrors: true,
});

const maSearchUrl = "https://www.metal-archives.com/search/ajax-advanced/searching/bands/"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let updateBandsData = {}
let updateBandsDataMulti = {}
let counter = 0

for (let band in bandsDataMulti) {
  if (bandsDataMulti[band].country === "") continue
  if (bandsDataMulti[band].id !== "multi") continue
  const maSearchParams = new URLSearchParams("?bandName=&country=&exactBandMatch=1")
  maSearchParams.set("bandName", band)
  maSearchParams.set("country", bandsDataMulti[band].country)

  const response = await impit.fetch(`${maSearchUrl}?${maSearchParams.toString()}`);

  let data = await response.json()

  console.log(counter, band)

  if (data.aaData && data.aaData.length) {
    let bands = data.aaData.map((i) => {
      const $ = cheerio.load(i[0]);
      let link = $("a").attr("href")
      let id = link.split("/").pop()
      let genre = i[1]
      return {id, genre, country: isoCountries.getName(bandsDataMulti[band].country, "en")}
    })
    for (let multiBand of bands) {
      await delay(3000)

      let maBandDiscographyUrl = `https://www.metal-archives.com/band/discography/id/${multiBand.id}/tab/all`;

      const response = await impit.fetch(maBandDiscographyUrl);

      let html = await response.text();

      const $ = cheerio.load(html);

      let discography = [];

      let parsed = $("tbody tr").toArray();

      parsed.forEach((i) => {
        let item = $("td", i);
        const matches = item.eq(3).text().match(/\d+/g);
        discography.push({
          album: item.eq(0).text(),
          year: item.eq(2).text(),
          reviews: matches && matches[0] ? parseInt(matches[0]) : 0,
          rating: matches && matches[1] ? parseInt(matches[1]) : 0,
        });
      });
      multiBand.discography = discography
      console.log(counter, band)
    }
    bands.forEach((i) => {
      console.log(i, "\n")
    })
  } 
  break
}
