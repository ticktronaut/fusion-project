var nodes = [
  { id: "linux", group: 0, label: "GNU Linux", level: 1 },
  { id: "freertos", group: 0, label: "freeRTOS", level: 1 },
  { id: "openamp"   , group: 0, label: "openAMP"   , level: 2 },
  { id: "cpp"   , group: 0, label: "C/C++"   , level: 2 },
  { id: "r"   , group: 0, label: "R"   , level: 2 },
  { id: "python"   , group: 0, label: "Python"  , level: 1 },
  { id: "jupyter"   , group: 0, label: "Jupyter"    , level: 1 },
  { id: "tensorflow", group: 1, label: "TensorFlow", level: 2 },
  { id: "scikit-learn"   , group: 1, label: "scikit-learn"   , level: 2 },
  { id: "numpy"   , group: 1, label: "NumPy"   , level: 2 },
  { id: "scipy"  , group: 2, label: "SciPy"   , level: 2 },
  { id: "matplotlib"  , group: 2, label: "Matplotlib"   , level: 2 },
  { id: "bokeh"  , group: 2, label: "Bokeh"   , level: 2 },
  { id: "html5"  , group: 2, label: "HTML5"   , level: 2 },
  { id: "javascript"  , group: 2, label: "JavaScript"   , level: 2 },
  { id: "d3"  , group: 2, label: "D3"   , level: 2 },
  { id: "ros"  , group: 2, label: "Robot Operating System"  , level: 2 },
  { id: "gsl"  , group: 2, label: "GNU Scientific Library"  , level: 2 }
]
var links = [
	{ target: "linux", source: "openamp" , strength: 0.8 },
	{ target: "linux", source: "cpp" , strength: 0.7 },
    { target: "linux", source: "r" , strength: 0.1 },
    { target: "linux", source: "python" , strength: 0.7 },
    { target: "linux", source: "jupyter" , strength: 0.2 },
    { target: "linux", source: "ros" , strength: 0.3 },
    { target: "linux", source: "javascript" , strength: 0.2 },
    { target: "ros", source: "python" , strength: 0.1 },
    { target: "ros", source: "cpp" , strength: 0.1 },
    { target: "linux", source: "html5" , strength: 0.2 },
    { target: "python", source: "tensorflow" , strength: 0.3 },
    { target: "python", source: "scikit-learn" , strength: 0.3 },
    { target: "python", source: "matplotlib" , strength: 0.3 },
    { target: "python", source: "bokeh" , strength: 0.2 },
    { target: "python", source: "numpy" , strength: 0.3 },
    { target: "python", source: "scipy" , strength: 0.3 },
    { target: "openamp", source: "cpp" , strength: 0.1 },
    { target: "openamp", source: "freertos" , strength: 0.1 },
    { target: "numpy", source: "scipy" , strength: 0.7 },
    { target: "jupyter", source: "cpp" , strength: 0.7 },
    { target: "jupyter", source: "r" , strength: 0.7 },
    { target: "jupyter", source: "javascript" , strength: 0.3 },
    { target: "jupyter", source: "html5" , strength: 0.4 },
    { target: "scikit-learn", source: "numpy" , strength: 0.1 },
    { target: "tensorflow", source: "numpy" , strength: 0.1 },
    { target: "matplotlib", source: "numpy" , strength: 0.1 },
    { target: "numpy", source: "bokeh" , strength: 0.1 },
    { target: "cpp", source: "freertos" , strength: 0.7 },
    { target: "cpp", source: "gsl" , strength: 0.4 },
    { target: "javascript", source: "d3" , strength: 0.7 },
    { target: "html5", source: "javascript" , strength: 0.4 },
    { target: "cpp", source: "gsl" , strength: 0.4 },
	{ target: "python"  , source: "jupyter" , strength: 0.3 }
]
function getNeighbors(node) {
  return links.reduce(function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      return neighbors
    },
    [node.id]
  )
}
function isNeighborLink(node, link) {
  return link.target.id === node.id || link.source.id === node.id
}
function getNodeColor(node, neighbors) {
  if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
    return node.level === 1 ? 'orange' : 'orangered'
  }
  return node.level === 1 ? 'lightgrey' : 'black'
}
function getLinkColor(node, link) {
  return isNeighborLink(node, link) ? 'orange' : '#E5E5E5'
}
function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'grey' : 'black'
}

var svg = d3.select("#tech-force").append("svg").attr('id', 'tech-force-svg');

var tech_force = document.getElementById("tech-force");
var width = tech_force.clientWidth;
var height = 500;//tech_force_svg.clientHeight;

svg.attr('width', width).attr('height', height);

var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return link.strength })
var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-520))
  .force('center', d3.forceCenter(width / 2, height / 2))
var dragDrop = d3.drag().on('start', function (node) {
  node.fx = node.x
  node.fy = node.y
}).on('drag', function (node) {
  simulation.alphaTarget(0.7).restart()
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('end', function (node) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  node.fx = null
  node.fy = null
})
function selectNode(selectedNode) {
  var neighbors = getNeighbors(selectedNode)
  // we modify the styles to highlight selected nodes
  nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
  linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}
var linkElements = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
    .attr("stroke-width", 1)
	  .attr("stroke", "rgba(50, 50, 50, 0.2)")
var nodeElements = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes)
  .enter().append("circle")
    .attr("r", 10)
    .attr("fill", getNodeColor)
    .call(dragDrop)
    .on('click', selectNode)
var textElements = svg.append("g")
  .attr("class", "texts")
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
    .text(function (node) { return  node.label })
	  .attr("font-size", 15)
	  .attr("dx", 15)
    .attr("dy", 4)
simulation.nodes(nodes).on('tick', () => {
  nodeElements
    .attr('cx', function (node) { return node.x })
    .attr('cy', function (node) { return node.y })
  textElements
    .attr('x', function (node) { return node.x })
    .attr('y', function (node) { return node.y })
  linkElements
    .attr('x1', function (link) { return link.source.x })
    .attr('y1', function (link) { return link.source.y })
    .attr('x2', function (link) { return link.target.x })
    .attr('y2', function (link) { return link.target.y })
})
simulation.force("link").links(links)

resize();
d3.select(window).on("resize", resize);

function resize() {
  width = tech_force.clientWidth; height = tech_force.clientHeight;
  svg.attr("width", width).attr("height", height)
//  force.size([width, height]).resume()
  simulation.force('center')
    .x(width / 2)
    .y(height / 2)
  simulation.alpha(0.3).restart();
  /*console.log("do resize");
  console.log("width: " + width)*/
}