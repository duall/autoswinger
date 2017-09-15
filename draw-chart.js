const dataSource = require('./compiled/data.json');
const timemachine = require('./compiled/timemachine.json');
const fs = require('fs');
const output = require('d3node-output');
const d3 = require('d3-node')().d3;
const d3nLine = require('d3node-linechart');
// const data = dataSource.map(d => {
//     return {
//         key: new Date(d.date * 1000),
//         value: + d.change48H
//     };
// });
const data = timemachine.map(d => {
    return {
        key: new Date(d.date * 1000),
        value: + d.assets_in_usd
    };
});


// create output files
output('./compiled/chart', d3nLine({data: data}));
