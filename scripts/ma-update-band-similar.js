import { Impit } from "impit";
import * as cheerio from "cheerio";
import fs from "fs";
import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" };
import bandsSimilar from "../src/data-metal-archives/bands-data-similar.json" with { type: "json" };
import bandsWithCountry from "../src/data/bmp-bands-with-country.json" with { type: "json" };

let bandsCount = Object.keys(bandsData).length;

const impit = new Impit({
  browser: "chrome", // or "firefox"
  ignoreTlsErrors: true,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let updateBandsData = {};
let counter = 0;

for (let band in bandsData) {
  if (bandsSimilar[band] && bandsSimilar[band].length) continue

  let maSimilarBandsUrl = `https://www.metal-archives.com/band/ajax-recommendations/id/${bandsData[band].id}/showMoreSimilar/1`;

  const response = await impit.fetch(maSimilarBandsUrl);

  let html = await response.text();

  const $ = cheerio.load(html);

  let bands = [];

  let parsed = $("tbody tr:not(:last-child)").toArray();

  if (
    $("td").eq(0).text() !== "No similar artist has been recommended yet. (Read more about this.)"
  ) {
    parsed.forEach((i) => {
      let item = $("td", i);
      bands.push([item.eq(0).text(), parseInt(item.eq(3).text().trim())]);
    });
  }

  updateBandsData[band] = bands;

  console.log(counter, bandsCount, band);

  await delay(3000);

  counter++;
  if (counter > 100) break;
}

let dataDir = "./src/data-metal-archives/";

fs.writeFileSync(`${dataDir}bands-data-similar.json`, JSON.stringify({ ...bandsSimilar, ...updateBandsData }));
