class Scraper {
    constructor() {
      this.rewriter = new HTMLRewriter()
      return this
    }

    async fetch(url) {
        this.response = await fetch(url)

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
        const urlScraper = new ImageScraper()
        await new HTMLRewriter().on('img', urlScraper).transform(this.response).arrayBuffer()
        return urlScraper.imgArray || []
    }
}

class ImageScraper {
    constructor() {
      this.imgArray = []
    }
   
    element(element) {
        const url = element.getAttribute('src')
        const alt = element.getAttribute('alt')

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
  