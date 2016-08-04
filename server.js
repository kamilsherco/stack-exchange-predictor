var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/h', function(req, res) {
    console.log(req.query);
    var json = {
        exchange: []
    };

    if (req.query.s) {
        url = 'http://stooq.pl/q/d/?s=' + req.query.s;

    request(url, function(error, response, html) {

        if (!error) {
            var $ = cheerio.load(html);
            var exchange = [];

            $('#fth1').filter(function() {
                var data = $(this).children().last().children();
                for (var i = 0; i < data.length; i++) {
                    var row = $(data[i]).children();
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

        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send(JSON.stringify(json, null, 4))

    });
  } ;
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
