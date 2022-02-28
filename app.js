//JS is based on an object-based paradigm. An object is a collection of properties, and a property is an association between a name and a value.
const data = []
// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 30, left: 60}
const width = 1000
const height = 600
const innerWidth = 1000 - margin.left - margin.right;
const innerHeight = 600 - margin.top - margin.bottom;
const chartColor = "#2ad178"
const svg = d3.select('#chart').append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "chart")
const chartArea = document.getElementsByClassName('chart')[0]
const body = document.getElementsByTagName('body')[0]
const population = 67114995

fetch('https://www.data.gouv.fr/api/1/datasets/r/cbd6477e-bda6-485d-afdc-8e61b904d771')
  .then(res => res.text())
  .then(data => splitIntoRows(data))
  .then(rows => {
    console.log(rows[0])
    rows.forEach(row => {
      const myRow = row.split(';') //we split the row into columns
      //JS is based on an object-based paradigm. An object is a collection of properties, and a property is an association between a name and a value.
      const myobject = {}
      myobject.semaine = new Date(myRow[1].slice(-10)) //this is the ulterior date, meaning the last day of the gliding week
      myobject.positifs = parseInt(myRow[3])
      data.push(myobject)
    });
    //console.log(data[0].semaine.slice(-10))
    return data //we created an array of objects named data
  })
  .then(dataArray => {
    console.log(dataArray.slice(0,2)) //logs the two first objects of the array
    console.log(typeof dataArray[0].positifs)
    renderChart(dataArray)
    dataLength(data)
    peak(data)
  })

function splitIntoRows(data) {
  // \n is an escape char sequence that designates a line break
  // we use slice() to remove the 1st and last row (it was empty). slice() creates a copy of a portion of an array
  const header = data.split('\n')[0]
  const rows = data.split('\n').slice(1, -1)
  console.log(header)
  console.log(rows[0])
  console.log(rows.at(-1))
  return rows;
}

function renderChart(data) { //here data corresponds to an array of objects

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d.positifs;} )])
      .range([innerHeight, 0])
      .nice()
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

    const xScale = d3.scaleTime()
      .domain([new Date(data[0].semaine), new Date(data.at(-1).semaine)]) //the domain is made of the 1st and last dates available in the data array
      .range([0, innerWidth])
      .nice();
    // Add X axis
    svg.append("g")
      .attr("class", "axisBottom")
      .attr("transform", "translate(0, " + innerHeight + ")")
      .call(d3.axisBottom(xScale)); //call method allows a function to be called into which the selection itself is passed as the 1st argument

  //draw the line of the chart
  const container = document.getElementsByClassName('chart')[0]
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  g.setAttribute('id', 'lineChart')
  container.appendChild(g)

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", chartColor)
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x( d => xScale(d.semaine) )
      .y(d => yScale(d.positifs) )
    )

  //ADD TITLE
  svg.append('text')
    .attr('x', innerWidth/2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('font-size', '17px')
    .style('fill', 'currentcolor')
    .text('Weekly Covid Cases in France per 100 000 inhabitants')

  overlay(xScale, yScale)
}

function dataLength(data) { //this function is called a bit after fetch()
  const div = document.createElement('div')
  div.innerText = 'Number of data points: ' + data.length
  body.appendChild(div)
}

function peak(data) { //this function is called a bit after fetch()
  const div = document.createElement('div')
  let peak = 0
  let peakWeek
  data.map(object => {
    if (object.positifs > peak) {
      peak = object.positifs
      peakWeek = object.semaine
    }
  })
  div.innerText = 'Peak: ' + Math.round(peak/population*100000) + ' on ' + peakWeek.toLocaleDateString()
  div.style.marginBottom = '8px'
  body.appendChild(div)
}