import * as express from 'express';
import * as request from 'request';
import * as cheerio from 'cheerio';


let baseUrl = 'http://stooq.pl/q/d/?s=';
let json: any = {exchange: []};
//
export function historicalData(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/h',
    (req: any, res: any, next: any) => {
      let exchange: any = [];

      if (req.query.s) {
        let url: any = baseUrl + req.query.s;

        request(url, function (error: any, response: any, html: any) {

          if (!error) {
            let $ = cheerio.load(html);


            exchange = [];
            $('#fth1').filter(function () {
              let data = $(this).children().last().children();
              console.log($(data[0]).children());
              if(data) {
                for (let i = 0; i < data.length; i++) {
                  let row = $(data[i]).children();
                  exchange.push({
                    "date": $(row[1]).text(),
                    "open": $(row[2]).text(),
                    "max": $(row[3]).text(),
                    "min": $(row[4]).text(),
                    "close": $(row[5]).text(),
                    "volume": $(row[6]).text()
                  });
                }
                json.exchange = exchange;
                res.send(JSON.stringify(json, null, 4));
                return true;
              }else{
                res.send(JSON.stringify({"error": "Data error"}, null, 4));
                return false;
              }

            });

          } else {
            res.send(JSON.stringify({"error": "Request error"}, null, 4));
          }

        });
      } else {
        res.send(JSON.stringify({"error": "Invalid parameter"}, null, 4));
      }

    });

}

