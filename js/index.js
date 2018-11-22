d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', render);

function render(data) {
  var container_dim = {width:1500, height:650},
      margins = {top:80,right:40,bottom:80,left:70},
      chart_dim = {
        width:container_dim.width-margins.left-margins.right,
        height:container_dim.height-margins.top-margins.bottom
      };
  var baseTemp = data.baseTemperature;
  var dataVariance = data.monthlyVariance;
  var rect_dim = {width:4.8, height: chart_dim.height / 12};
  var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  var divtt = d3.select('body')
  .append('div')
  .attr('id', 'tooltip');

  var svg = d3.select('body')
  .append('svg')
  .attr('width', container_dim.width)
  .attr('height', container_dim.height);

  var plot = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

  var yrScale = d3.scaleLinear()
  .domain(d3.extent(dataVariance, function(d) { return d.year; }))
  .range([0,chart_dim.width]);

  var moScale = d3.scaleLinear()
  .domain([0.5,12.5])
  .range([0,chart_dim.height]);

  var colorScale = d3.scaleOrdinal()
  .domain([10,9,8,7,6,5,4,3,2,1,0])
  .range(d3.schemeRdBu[11]);

  var xAxis = d3.axisBottom(yrScale)
  .ticks(20)
  .tickFormat(d3.format(''));

  var yAxis = d3.axisLeft(moScale)
  .tickFormat(function(d,i) { 
    return months[i];
  });

  var divLegend = d3.select('body')
  .append('div')
  .attr('id','legend');

  for (var i=0; i<11; i++) {
    divLegend.append('div')
      .attr('class', 'square')
      .style('background-color', colorScale(i))
      .html((2.8+1.1*i).toFixed(1));
  }

  plot.append('g')
    .attr('id','x-axis')
    .attr('transform', 'translate(0,' + chart_dim.height + ')')
    .call(xAxis);

  plot.append('g')
    .attr('id', 'y-axis')
    .call(yAxis);

  plot.append('g')
    .attr('id', 'title')
    .append('text')
    .text('Monthly Global Land-Surface Temperature')
    .style('font-family', 'Arial')
    .style('font-size', '150%')
    .attr('y',-40);

  plot.append('g')
    .attr('id', 'subtitle')
    .append('text')
    .text('1753 - 2015: base temperature 8.66 C')
    .style('font-family', 'Arial')
    .style('font-size', '100%')
    .attr('y',-15);

  var rects = plot.selectAll('rect')
  .data(dataVariance)
  .enter()
  .append('rect')
  .attr('x', function(d) { return yrScale(d.year); })
  .attr('y', function(d) { return (d.month-1) * rect_dim.height; })
  .attr('width', rect_dim.width)
  .attr('height', rect_dim.height)
  .attr('fill', function(d,i) { 
    return colorScale(Math.floor((d.variance+6.976)/1.11)); 
  })

  rects.on('mouseover', function(d) { 
    var msg = d.year + ' - ' + months[d.month-1] + '<br>';
    msg += (baseTemp + d.variance).toFixed(1) + ' C <br>';
    msg += d.variance.toFixed(1) + ' C';
    divtt
      .style('display', 'block')
      .style('top', d.month * rect_dim.height - 30 + 'px')
      .style('left', yrScale(d.year) + margins.left - 30 + 'px')
      .style('opacity', 0.7)
      .html(msg);
  });

  rects.on('mouseout', function(d) {
    divtt
      .style('display','none');
  });
}