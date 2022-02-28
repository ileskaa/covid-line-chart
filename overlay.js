function overlay(xScale, yScale) {
  const len = data.length
  const max = data[len-1].semaine
  const overlayWidth = xScale(max)- margin.left
  const rectWidth = overlayWidth/len

  const node = document.createElement('div')
    node.className = 'tooltip'
    node.style.top = '40px'
    node.style.transform = `translate( ${xScale(data[len-1].semaine)}px)`
    node.innerHTML = `${max.toLocaleDateString()}
                      <br>Weekly cases per 100 000 inhabitants: ${Math.round(data[len-1].positifs/67114995*100000)}`
  document.body.appendChild(node)

  const mouseEnter = event => {
    let date = new Date(event.target.dataset.week)
    let xScaleDate = xScale(date)
    let positives = event.target.dataset.positives
    circle.style.transform = `translate(${xScaleDate}px, ${yScale(positives)}px)` //translate(x,y). When y decreases, the circle moves up
    tooltipLine.style.transform = `translate(${xScaleDate}px`

    node.style.transform = `translate(${xScaleDate}px`
    node.innerHTML = `${date.toLocaleDateString()}
      <br>Weekly cases per 100 000 inhabitants: ${Math.round(positives/population*100000)}`
  }

  function createRect(i, x, width) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x)
    rect.setAttribute('width', width)
    rect.setAttribute('height', innerHeight)
    rect.setAttribute('class', 'dataRect')
    rect.setAttribute('data-positives', data[i].positifs)
    rect.setAttribute('data-week', data[i].semaine)
    rect.addEventListener('mouseenter', mouseEnter) //mouseenter is less ressource intensive than mouseover
    chartArea.appendChild(rect)
  }

  //let's render the first and last rectangles which should be bigger than the others
  const multiplier = 20
  createRect(0, margin.left - rectWidth*multiplier, rectWidth*(multiplier+1))
  createRect(len-1, margin.left + rectWidth*(len-1), rectWidth*(multiplier+1))

  let i = 1
  while (i < (len-1)) {
    createRect(i, margin.left + rectWidth*i, rectWidth)
    i++
  }

  const rect = document.getElementsByClassName('dataRect')[0]
  const Rect = rect.getBoundingClientRect()
  const lastWeekPosition = xScale(data[len-1].semaine)

  const circle = document.createElement('div')
    circle.setAttribute('id', 'circle')
    circle.style.left = margin.left + 'px'
    circle.style.top = Rect.top + 'px'
    circle.style.transform = `translate( ${lastWeekPosition}px, ${yScale(data[len-1].positifs)}px )`
  chart.appendChild(circle)
  console.log(Rect)

  const tooltipLine = document.createElement('div')
    tooltipLine.setAttribute('id', 'tooltipLine')
    tooltipLine.style.height = innerHeight + 'px'
    tooltipLine.style.left = margin.left + 'px'
    tooltipLine.style.top = Rect.top + 'px'
    tooltipLine.style.transform = `translate( ${lastWeekPosition}px, 0px )`
    //tooltipLine.style.height = 600 + 'px'
  chart.appendChild(tooltipLine)
}