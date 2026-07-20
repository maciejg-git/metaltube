import bandsData from "../../src/data-metal-archives/bands-data.json" with { type: "json" }
import bandsDataSimilar from "../../src/data-metal-archives/bands-data-similar.json" with { type: "json" }

export default async (request, context) => {
  let requestUrl = new URL(request.url)
  let searchParams = new URLSearchParams(requestUrl.searchParams)
  let band = searchParams.get("band")

  if (bandsDataSimilar[band]) {
    return new Response(JSON.stringify(bandsDataSimilar[band]))
  } else {
    return new Response("[]")
  }
}
