import * as express from 'express';
import * as request from 'request';
import * as cheerio from 'cheerio';


let baseUrl= 'http://stooq.pl/q/d/?s=';
let json = {exchange: []};
//
export function historicalData(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/h',
    (req:any, res:any, next:any) => {
      let exchange = [];

      if (req.query.s) {
        let url = baseUrl + req.query.s;

        request(url, function (error, response, html) {

          if (!error) {
            let $ = cheerio.load(html);



            $('#fth1').filter(function () {
              let data = $(this).children().last().children();
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

            })
            res.send(JSON.stringify(json, null, 4))
          }else{
            res.send(JSON.stringify("error", null, 4))
          }

          // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.

        });
      }else{

      }

     // res.json("hello");
    });

}

