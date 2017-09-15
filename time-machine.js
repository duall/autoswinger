let data = require('./compiled/data.json');

console.log('Script running');

let usd;
let btc0;
let exportArray = [];

function doTrade(item, rules) {
    var buyBTC = function() {
        if(usd) {
            btc = usd / item.close;
            usd = 0;
            exportArray.push({ date: item.date, type: 'buy', price: item.close, assets_in_usd: btc * item.open });
            //console.log('buy for ' + item.close);
        }
    }
    var sellBTC = function() {
        if(btc) {
            usd = btc * item.open;
            btc = 0;
            exportArray.push({ date: item.date, type: 'sell', price: item.open, assets_in_usd: usd });
            //console.log('sell for ' + item.open);
        }
    }
    if(
        (rules.diff24 === false || item.change24H > rules.diff24)
        && (rules.diff05 === false || item.change05H > rules.diff05)
    ) {
        buyBTC('ALL', item);
    }
    else if(
        (rules.diff24 === false || item.change24H < rules.diff24)
        && (rules.diff05 === false || item.change05H < rules.diff05)
    ) {
        sellBTC('ALL', item);
    }
    // console.log('USD:', usd);
    // console.log('BTC:' + btc + ' ('+ btc * item.weightedAverage +' USD)');
}

function timeMachine(rules) {
    data.forEach(function(item) {
        doTrade(item, rules);
    });
}

// timeMachine({
//     diff05: false,
//     diff24: 0.24
// });

usd = 100; btc = 0;
timeMachine({
    diff05: 0,
    diff24: false
});
console.log('USD:', usd);
console.log('BTC:' + btc + ' ('+ btc * data[data.length - 1].weightedAverage +' USD)');

// Export
var jsonfile = require('jsonfile')
jsonfile.writeFileSync('./compiled/timemachine.json', exportArray)
