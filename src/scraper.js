class Scraper {
    constructor() {
      this.rewriter = new HTMLRewriter()
      return this
    }

    async fetch(url) {
        this.response = await fetch(url)
        this.url = new URL(url)

        const server = this.response.headers.get('server')
        const isWorkerErrorNotScrapedSite = (
            [530, 503, 502, 403, 400].includes(this.response.status) &&
            (server === 'cloudflare' || !server /* Workers preview editor */)
        )
        if (isWorkerErrorNotScrapedSite) {
            throw new Error(`Status ${ this.response.status } requesting ${ url }`)
        }

        return this
    }


    async getImages() {
        const urlScraper = new ImageScraper(this.url)
        await new HTMLRewriter().on('img', urlScraper).transform(this.response).arrayBuffer()
        return urlScraper.imgArray || []
    }
}

class ImageScraper {
    constructor(url) {
      this.imgArray = []
      this.hostname = url.hostname
    }
   
    element(element) {
        let url = element.getAttribute('src')
        let alt = element.getAttribute('alt')

        // If the image URL is partial path then appeand hostname to front
        if (url[0] === '/') {
            url = "http://" + this.hostname + url
        }

        // This will add an image URL and alt text to the array if it does not alreay exist
        let index = this.imgArray.indexOf(x => x.url == url);
        if (index === -1){
            this.imgArray.push(
                {
                    "url": url,
                    "alt": alt,
                }
            )
        }
    }

}
  
export default Scraper
  