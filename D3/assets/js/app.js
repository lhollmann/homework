var margin = 50;
var labelArea = 110;
var downSpace = 50;
var leftSpace = 50;

var wide = 1000;
var hight = 600;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", wide)
  .attr("height", high)
  .attr("class", "chart");

var pointSize;
function pointMaker() {
  if (width <= 600) {
    circRadius = 6;
  }
  else {
    circRadius = 12;
  }
}
pointMaker();

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

xText.attr("transform","translate" +((wide - labelArea) / 2 + labelArea) +", " +(high - margin - downSpace) +")");

xText
  .append("text")
  .attr("y", -30)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Poverty%");

svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

yText.attr("transform","translate" +((high - labelArea) / 2 + labelArea) +", " +(wide - margin - leftSpace) +")");

yText
  .append("text")
  .attr("y", -30)
  .attr("data-name", "obesity")
  .attr("data-axis", "x")
  .attr("class", "aText active y")
  .text("Obese%");

function visualizer(theData) {
  var curX = "poverty";
  var curY = "obesity";

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([50, -50])
    .html(function(d) {
      var exe;
      var state = "<div>" + d.state + "</div>";
      var why = "<div>" + curY + ": " + d[curY] + "%</div>";
      if (curX === "poverty") {
        exe = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        exe = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return state + exe + why;
    });
  svg.call(toolTip);

  function xMinMax() {
    xMin = d3.min(data, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    xMax = d3.max(data, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  function yMinMax() {
    yMin = d3.min(data, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    yMax = d3.max(data, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  function labelChange(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    clickedText.classed("inactive", false).classed("active", true);
  }

  xMinMax();
  yMinMax();
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, wide - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([high - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  ticks = 10;

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (high - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  var circles = svg.selectAll("g circles").data(data).enter();

  circles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#000000");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#FFFFFF");
    });

  circles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#000000");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#FFFFFF");
    });
}

d3.csv("assets/data/data.csv").then(function(data) {
  visualizer(data);
});