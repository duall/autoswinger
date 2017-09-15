const dataSource = require('./compiled/data.json');
const timemachine = require('./compiled/timemachine.json');
var plotly = require('plotly')("duall", "saD6bRMHajGGB1lcokMd")

var data = [
    {
        x: timemachine.map(d => {
            return new Date(d.date * 1000);
        }),
        y: timemachine.map(d => {
            return d.assets_in_usd - 100;
        }),
        name: "profit",
        type: "scatter"
    }, {
        x: dataSource.map(d => {
            return new Date(d.date * 1000);
        }),
        y: dataSource.map(d => {
            return d.weightedAverage;
        }),
        name: "market",
        yaxis: "y2",
        type: "scatter"
    }
];
var layout = {
  title: "Double Y Axis Example",
  yaxis: {title: "yaxis title"},
  yaxis2: {
    title: "yaxis2 title",
    titlefont: {color: "rgb(148, 103, 189)"},
    tickfont: {color: "rgb(148, 103, 189)"},
    overlaying: "y",
    side: "right"
  }
};
var graphOptions = {
    layout: layout,
    filename: "multiple-axes-double",
    fileopt: "overwrite"
};
plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
});
