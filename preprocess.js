let poloniexData = require('./data/2017_half_hour_usdt_btc_poloniex.json'); // https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&start=1483228800&end=9999999999&period=1800

console.log('Script running');

/** Preprocess data with margins
 date	unix timestamp
 high	candle attribute - higher price in period
 low	candle attribute - lower price in period
 open	candle attribute - opening price in period
 close	candle attribute - closing price in period
 volume	volume of base currency in period
 quoteVolume       	volume of quote currency in period
 weightedAverage	weighted average in period
 ---
 change_05H
 change_1H
 change_2H
**/

function populatePrices(name, source, item) {
    var price = (source.weightedAverage);
    var change = 100 - (price / item.weightedAverage * 100);
    item['price' + name] = price;
    item['change' + name] = change;
}

poloniexData.forEach(function(item) {
    item.index = poloniexData.indexOf(item);
    if(item.index < 100) { return; } // Collect some data before process

    // Go trough previous indexed items to get data ( every 0.5 hour )
    let prev;
    populatePrices('05H', poloniexData[prev = item.index - 0.5 * 2], item);
    populatePrices('1H', poloniexData[prev = item.index - 1 * 2], item);
    populatePrices('4H', poloniexData[prev = item.index - 4 * 2], item);
    populatePrices('8H', poloniexData[prev = item.index - 8 * 2], item);
    populatePrices('12H', poloniexData[prev = item.index - 12 * 2], item);
    populatePrices('24H', poloniexData[prev = item.index - 24 * 2], item);
    populatePrices('48H', poloniexData[prev = item.index - 48 * 2], item);

    console.log(item);
});

// Remove first 100 items
poloniexData.splice(0, 100);

// Export
var jsonfile = require('jsonfile')
jsonfile.writeFileSync('./compiled/data.json', poloniexData)
