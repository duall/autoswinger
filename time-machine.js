let data = require('./compiled/data.json');

console.log('Script running');

let usd;
let btc0;
let exportArray = [];

function doTrade(item, rules) {
    var buyBTC = function() {
        if(usd) {
            btc = usd / item.high;
            usd = 0;
            exportArray.push({ date: item.date, type: 'buy', price: item.close, assets_in_usd: btc * item.open });
            //console.log('buy for ' + item.close);
        }
    }
    var sellBTC = function() {
        if(btc) {
            usd = btc * item.low;
            btc = 0;
            exportArray.push({ date: item.date, type: 'sell', price: item.open, assets_in_usd: usd });
            //console.log('sell for ' + item.open);
        }
    }
    if(
        (rules.Bdiff24 === false || item.change24H > rules.Bdiff24)
        && (rules.Bdiff05 === false || item.change05H > rules.Bdiff05)
        && (rules.Bdiff1 === false || item.change1H > rules.Bdiff1)
        && (rules.Bdiff48 === false || item.change48H > rules.Bdiff48)
    ) {
        buyBTC('ALL', item);
    }
    else if(
        (rules.Sdiff24 === false || item.change24H < rules.Sdiff24)
        && (rules.Sdiff05 === false || item.change05H < rules.Sdiff05)
        && (rules.Sdiff1 === false || item.change1H < rules.Sdiff1)
        && (rules.Sdiff48 === false || item.change48H < rules.Sdiff48)
    ) {
        sellBTC('ALL', item);
    }
    // console.log('USD:', usd);
    // console.log('BTC:' + btc + ' ('+ btc * item.weightedAverage +' USD)');
}

function timeMachine(rules) {
    data.forEach(function(item) {
        //if(item.date > 1502755200) {
            doTrade(item, rules);
        //}
    });
}

usd = 100; btc = 0;
timeMachine({
    Bdiff05: 0.2,
    Sdiff05: 0.4,
    Bdiff1: 0.1,
    Sdiff1: 0.001,
    Bdiff24: 2.9,
    Sdiff24: 0.1,
    Bdiff48: 0.5,
    Sdiff48: 0.05
});
console.log('USD:', usd);
console.log('BTC:' + btc + ' ('+ btc * data[data.length - 1].weightedAverage +' USD)');

// Export
var jsonfile = require('jsonfile')
jsonfile.writeFileSync('./compiled/timemachine.json', exportArray)
