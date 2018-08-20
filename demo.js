var htmlPainting = require(".")
var app = require("express")()
var element = require("web-element")

htmlPainting.stroke(
  "workshop",
  wood(),{
  "minX": 4,
  "maxX": 8,
  "minY": 0,
  "maxY": 72})

htmlPainting.stroke(
  "workshop",
  wood(),{
  "minX": 70,
  "maxX": 74,
  "minY": 0,
  "maxY": 72})


var painting = element(
  ".painting",
  element.style({
    "position": "relative",
    "width": "80px",
    "height": "80px",
    "background": "#eef"}))

painting.addChildren(
  htmlPainting.dumpToElements(
    "workshop"))

app.get("/", function(request, response) {
  response.send(painting.html())
})

app.listen(1441)
console.log("html-painting demo listening on http://localhost:1441")

function error() {
  return parseInt(Math.random()*100-50)
}

function wood() {
  var r = 250+error()
  var g = 150+error()
  var b = 100+error()
  return "rgb("+r+","+g+","+b+")"
}
