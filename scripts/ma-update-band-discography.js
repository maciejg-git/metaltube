import { Impit } from "impit";
import * as cheerio from "cheerio";
import fs from "fs";
import bandsData from "../src/data-metal-archives/bands-data.json" with { type: "json" };
import bandsDiscography from "../src/data-metal-archives/bands-data-discography.json" with { type: "json" }

let bandsCount = Object.keys(bandsData).length;

const impit = new Impit({
  browser: "chrome", // or "firefox"
  ignoreTlsErrors: true,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let updateBandsData = {};
let counter = 0;

for (let band in bandsData) {
  if (bandsDiscography[band]) continue

  let id = bandsData[band]?.id;

  if (!id || id === "multi") continue;

  let maBandDiscographyUrl = `https://www.metal-archives.com/band/discography/id/${id}/tab/all`;

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

  updateBandsData[band] = discography;

  console.log(counter, bandsCount, band);

  await delay(3000);

  counter++;
  if (counter > 500) break;
}

let dataDir = "./src/data-metal-archives/";

fs.writeFileSync(`${dataDir}bands-data-discography.json`, JSON.stringify({ ...bandsDiscography, ...updateBandsData }));
