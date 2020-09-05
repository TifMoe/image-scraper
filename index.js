import Scraper from './src/scraper.js'
import { JSONResponse, JSONErrorResponse } from './src/json-response.js'


addEventListener("fetch", event => {
    const request = event.request;
    if (request.method === "OPTIONS") {
        event.respondWith(handleOptions(request));
    }
    
    if (request.method === "GET") {
        event.respondWith(handle(request));
    } else {
        return JSONErrorResponse("invalid method: only GET is supported", 405);
    }
});

async function handle(request) {
    const searchParams = new URL(request.url).searchParams
    const pretty = searchParams.get('pretty')

    let url = searchParams.get('url')
    if (url && !url.match(/^[a-zA-Z]+:\/\//)) url = 'http://' + url
    if (!url) {
      return  JSONErrorResponse("url is required param", 400, pretty)
    }

    // Scrape URL and return list of images as json
    try { 
        let scraper = await new Scraper().fetch(url)
        let images = await scraper.getImages()
        return JSONResponse({"images": images}, 200, pretty)
    } catch (err) {
        return JSONErrorResponse(err.message, 500, pretty);
    }
}

function handleOptions(request) {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        // Handle CORS pre-flight request.
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Client-Key"
            }
        });
    } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, POST, OPTIONS"
            }
        });
    }
}