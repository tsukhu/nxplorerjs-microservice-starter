import { Observable, from } from 'rxjs';
import * as scrapeIt from 'scrape-it';
import JsonDB from 'node-json-db';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import ILogger from '../../common/interfaces/ilogger';
import IScraper from '../interfaces/iscraper';

const amazonConfig = {
  title: '#productTitle',
  salePrice: 'tr#priceblock_ourprice_row td.a-span12 span#priceblock_ourprice',
  salePriceDesc: 'tr#priceblock_ourprice_row span.a-size-small.a-color-price',
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
            resolve(data);
          },
          error => {
            this.loggerService.error(error);
          }
        )
      )
    );
  };

  public getScrapedListData = (asinList: string): Observable<any> => {
    const res = asinList.split(',');
    const amazonUrl = 'https://www.amazon.in/dp/';
    const scrappedList = res.map(
      asin =>
        new Promise((resolve, reject) => {
          const asinUrl = `${amazonUrl}${asin}`;
          scrapeIt(asinUrl, this.getConfiguration(asinUrl)).then(
            ({ data, response }) => {
              resolve(data);
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

  public push(name: string, data: string): Observable<any> {
    if (this.db === undefined) {
      this.db = new JsonDB('productsDB', true, false);
    }
    return from(
      new Promise((resolve, reject) => {
        try {
          this.loggerService.info(name);
          this.db.push(`/${name}`, data);
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

  private getConfiguration = (url: string) => {
    if (url.toUpperCase().includes('AMAZON')) {
      return amazonConfig;
    } else {
      return defaultConfig;
    }
  };
}

export default ScraperService;
