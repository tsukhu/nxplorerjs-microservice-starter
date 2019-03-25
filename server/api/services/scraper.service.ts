import { Observable, from } from 'rxjs';
import * as scrapeIt from 'scrape-it';
import JsonDB from 'node-json-db';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import ILogger from '../../common/interfaces/ilogger';
import { IScraper, ScrapeData } from '../interfaces';

const supportedCountries = ['US', 'IN'];
const supportedMarketPlaces = ['AMAZON'];

const marketplaceConfig = [
  {
    marketplace: 'AMAZON',
    country: 'IN',
    url: 'https://www.amazon.in/dp/'
  },
  {
    marketplace: 'AMAZON',
    country: 'US',
    url: 'https://www.amazon.com/dp/'
  }
];

const amazonConfig = {
  title: '#productTitle',
  salePrice: 'tr#priceblock_ourprice_row td.a-span12 span#priceblock_ourprice',
  salePriceDesc: 'tr#priceblock_ourprice_row span.a-size-small.a-color-price',
  dealPrice: 'span#priceblock_dealprice',
  sellerPrice: {
    selector: 'div#toggleBuyBox span.a-color-price',
    convert: x => {
      if (x.charAt(0) === '$') {
        return x.slice(1);
      }
      return x;
    }
  },
  mrpPrice: 'div#price span.a-text-strike',
  savings: 'tr#regularprice_savings td.a-span12.a-color-price.a-size-base',
  brand: 'div#bylineInfo_feature_div a#bylineInfo',
  vat: 'tr#vatMessage',
  availiability: 'div#availability',
  vnv: 'div#vnv-container',
  features: {
    listItem: 'div#feature-bullets ul li',
    name: 'features',
    data: {
      feature: 'span.a-list-item'
    }
  },
  images: {
    listItem: 'div#imageBlock div#altImages ul li',
    name: 'altImages',
    data: {
      url: {
        selector: 'img',
        attr: 'src',
        convert: x => x.replace(/_[S][A-Z][0-9][0-9]_./g, '')
      }
    }
  },
  brandUrl: {
    selector: 'div#bylineInfo_feature_div a#bylineInfo',
    attr: 'href'
  },

  image: {
    selector: 'img#landingImage',
    attr: 'src'
  }
};

const defaultConfig = amazonConfig;
/**
 * Starwars Service Implementation
 */
@injectable()
class ScraperService implements IScraper {
  public loggerService: ILogger;
  public db: JsonDB;
  public dbPublish: JsonDB;
  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
  }

  public getScrapedData = (url: string): Observable<any> => {
    return from(
      new Promise((resolve, reject) =>
        scrapeIt(url, this.getConfiguration(url)).then(
          ({ data, response }) => {
            const scrapedData: any = data;
            const { dealPrice, salePrice, sellerPrice } = scrapedData;
            // if there is a deal then show that
            if (dealPrice.length > 0) {
              scrapedData.salePrice = dealPrice;
            } else if (
              // if sale price and deal price
              // are not available then fall back
              // on seller price
              salePrice.length === 0 &&
              dealPrice.length === 0 &&
              sellerPrice.length > 0
            ) {
              scrapedData.salePrice = sellerPrice;
            }

            resolve(scrapedData);
          },
          error => {
            this.loggerService.error(error);
          }
        )
      )
    );
  };

  public getScrapedListData = ({
    country,
    marketplace,
    baseUrl,
    asinList
  }): Observable<any> => {
    const res = asinList.split(',');
    const defaultUrl = this.getBaseURLFor(country, marketplace);
    // this.loggerService.info(defaultUrl);
    // override country,market place if the url is provided
    const scrapeBaseUrl = typeof baseUrl !== 'undefined' ? baseUrl : defaultUrl;
    const scrappedList = res.map(
      asin =>
        new Promise((resolve, reject) => {
          const asinUrl = `${scrapeBaseUrl}${asin}`;
          scrapeIt(asinUrl, this.getConfiguration(asinUrl)).then(
            ({ data, response }) => {
              const scrapedData: any = data;
              const { dealPrice, salePrice, sellerPrice } = scrapedData;
              // if there is a deal then show that
              if (dealPrice.length > 0) {
                scrapedData.salePrice = dealPrice;
              } else if (
                // if sale price and deal price
                // are not available then fall back
                // on seller price
                salePrice.length === 0 &&
                dealPrice.length === 0 &&
                sellerPrice.length > 0
              ) {
                scrapedData.salePrice = sellerPrice;
              }

              const updatedData = {
                ...scrapedData,
                id: asin,
                scrapedUrl: asinUrl,
                marketplace: 'Amazon',
                scrapeDate: new Date()
              };
              resolve(updatedData);
            },
            error => {
              reject(error);
            }
          );
        })
    );

    return from(
      new Promise((resolve, reject) =>
        Promise.all(scrappedList).then(
          values => resolve(values),
          error => reject(error)
        )
      )
    );
  };

  public push(
    name: string,
    data: string,
    theme: string,
    country: string
  ): Observable<any> {
    this.initDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          this.loggerService.info(name);
          this.db.push(`/${name}`, { data, theme, country });
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  public byMicrositeByID(name: string): Observable<any> {
    this.initDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          this.loggerService.info(name);
          const data = this.db.getData(`/${name}`);
          this.loggerService.info(data);
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  public getAll(): Observable<any> {
    this.initDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          const data = this.db.getData(`/`);
          this.loggerService.info(data);
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  public getAllSites(): Observable<any> {
    this.initPublishDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          const data = this.dbPublish.getData(`/`);
          this.loggerService.info(data);
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  public pushSite(name: string, data: string): Observable<any> {
    this.initPublishDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          this.loggerService.info(name);
          this.dbPublish.push(`/${name}`, data);
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  public byPublishedMicrositeByID(name: string): Observable<any> {
    this.initPublishDb();
    return from(
      new Promise((resolve, reject) => {
        try {
          this.loggerService.info(name);
          const data = this.dbPublish.getData(`/${name}`);
          this.loggerService.info(data);
          resolve(data);
        } catch (error) {
          // The error will tell you where the DataPath stopped. In this case test1
          // Since /test1/test does't exist.
          reject(error);
        }
      })
    );
  }

  private initDb = () => {
    if (this.db === undefined) {
      this.db = new JsonDB('productsDB', true, false);
    }
  };

  private initPublishDb = () => {
    if (this.dbPublish === undefined) {
      this.dbPublish = new JsonDB('publishDB', true, false);
    }
  };

  private getConfiguration = (url: string) => {
    if (url.toUpperCase().includes('AMAZON')) {
      return amazonConfig;
    } else {
      return defaultConfig;
    }
  };

  /**
   * Get the base URL based on the country and marketplace
   * In the country or marketplace are not supported return the default
   * url based on amazon india
   */
  private getBaseURLFor = (country: string, marketplace: string) => {
    let currentMarketPlace = 'AMAZON';
    let currentCountry = 'IN';
    const defaultURL = 'https://www.amazon.in/dp/';

    if (
      typeof marketplace !== 'undefined' &&
      supportedMarketPlaces.indexOf(marketplace.toUpperCase()) > -1
    ) {
      currentMarketPlace = marketplace.toUpperCase();
    }

    if (
      typeof country !== 'undefined' &&
      supportedCountries.indexOf(country.toUpperCase()) > -1
    ) {
      currentCountry = country.toUpperCase();
    }
    const marketplaceInfo = marketplaceConfig.find(
      item =>
        item.country === currentCountry &&
        item.marketplace === currentMarketPlace
    );

    return typeof marketplaceInfo !== 'undefined'
      ? marketplaceInfo.url
      : defaultURL;
  };
}

export default ScraperService;
