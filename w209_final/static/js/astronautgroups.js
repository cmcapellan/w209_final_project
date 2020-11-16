 // set up svg sizes
 var margin = {top: 20, right: 20, bottom: 70, left: 40},
 width = 800 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;
var x, y, xAxis, yAxis; //Empty, for now

//Nasa colors
var nasa_colors = ["#FC3D21","#0B3D91"];
var milciv_colors = ['#6B8E23','#9370DB'];

// import data 
d3.json("/static/data/gen_grp.txt", function(data) {
console.log(data);
dataset = data;

// Set up stack
var stack = d3.stack().keys(["pctW","pctM"]);

//data, stacked
var series = stack(dataset);

//Set up scales
var xScale = d3.scaleBand()
 .domain(d3.range(dataset.length))
 .rangeRound([0, width], .05)
 .paddingInner(0.05);
var yScale = d3.scaleLinear()
 .domain([0, d3.max(dataset, function(d) {
     return d.pctW + d.pctM;})])
 .range([0, height]);
       
//Create SVG element
var svg = d3.select("#sb_chart").append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform",
       "translate(" + margin.left + "," + margin.top + ")");

// Add a group for each row of data
var groups = svg.selectAll("g")
 .data(series)
 .enter()
 .append("g")
 .style("fill", function(d, i) {
   return nasa_colors[i];
 });

// set up tooltip
var tooltip = d3.select("body")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip")
 .style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "1px")
 .style("border-radius", "5px")
 .style("padding", "10px")

// Add a rect for each data value
var rects = groups.selectAll("rect")
 .data(function(d) { return d; })
 .enter()
 .append("rect")
 .attr("x", function(d, i) {
   return xScale(i);
 })
 .attr("y", function(d) {
   return yScale(d[0]);
 })
 .attr("height", function(d) {
   return yScale(d[1]) - yScale(d[0])
 })
 .attr("width", xScale.bandwidth())
 .on("mouseover", function(d, i) {
   return tooltip.style("opacity", 1)
   .html("<h5>Group: " + (i+1) + "</h5>" + 
     "Women: " + series[0][i]["data"]["W"] + "<br>" +
     "Men: " + series[0][i]["data"]["M"] + "<br><br>"+
     "<img src=\"static/images/grp_"+(i+1)+".jpg\" >")})
 .on("mousemove", function(d){
   return tooltip.style("top", (event.pageY-10)+"px")
     .style("left",(event.pageX+10)+"px");})
 .on("mouseout", function(d) {
   return tooltip.style("opacity", 0);});

//axis
var xAxis = d3.axisBottom()
 .scale(xScale);

svg.append("g")
 .attr("class", "x-axis")
 .attr("transform", "translate(0," + height + ")")
 .call(xAxis);

// text label for the x axis
// TODO: Figure out why we aren't seeing the group or number.
 svg.append("text")
 .attr("class", "x-axis-label")             
 .attr("transform",
   "translate(" + ((width)/2) + " ," + 
   (height + margin.top + margin.bottom/2) + ")")
 .style("text-anchor", "middle")
 .text("Group");

// Change vis data to Activity Calories
// TODO: Figure out why this won't change data to the new stacking
// https://stackoverflow.com/questions/18186011/how-to-update-data-in-stack-bar-chart-in-d3
d3.select("#button1")
 .on("click", function() {
 console.log("Ouch!")

 // Set up stack
 var stack = d3.stack().keys(["pctCiv","pctMil"]);
 //data, stacked
 var series = stack(dataset);

 //Set up scales
 var yScale = d3.scaleLinear()
   .domain([0, d3.max(dataset, function(d) {
       return d.pctW + d.pctM;})])
   .range([0, height]);

 // add color scale to series
 var groups = svg.selectAll("g")
   .transition().duration(1000)
   .style("fill", function(d, i) {
     return milciv_colors[i];
   });  

 // Add a rect for each data value
 var rects = groups.selectAll("rect")
   .transition().duration(1000)
   .attr("y", function(d) {
     return yScale(d[0]);
   })
   .attr("height", function(d) {
     return yScale(d[1]) - yScale(d[0])
   })


});

});