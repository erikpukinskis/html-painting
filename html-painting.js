var library = require("module-library")(require)

module.exports = library.export(
  "html-painting",
  ["identifiable", "add-html", "web-element"],
  function(identifiable, addHtml, element) {
    var ids = {}
    var colorListsById = {}
    var boundsListsById = {}
    var originsById = {}
    var sizesById = {}
    var zoomsById = {}
    var renderTargets = {}

    function htmlPainting(id) {
      if (ids[id]) {
        throw new Error("Already created html painting "+id)
      }
      id = identifiable.assignId(ids)
      return id
    }

    htmlPainting.dumpToElements = function(id) {
      var colorList = colorListsById[id]
      if (!colorList) {
        throw new Error("No html-painting with id "+id)}

      var boundsList = boundsListsById[id]

      var children = colorList.map(
        function(_, i) {
          return renderSwatch(
            colorList[i],
            boundsList[i])})

      return children
    }

    htmlPainting.stroke = function(id, color, bounds) {
      if (!colorListsById[id]) {
        colorListsById[id] = []
        boundsListsById[id] = []
      }

      colorListsById[id].push(color)
      boundsListsById[id].push(bounds)

      if (!renderTargets[id] || renderTargets[id].length < 1) { return }

      renderStroke(renderTargets[id], color, bounds)
    }

    htmlPainting.playBackInto = function(id, selector) {
      if (!id) {
        throw new Error("No id")
      }
      htmlPainting.renderTo(id, selector)
      var colors = colorListsById[id]
      var bounds = boundsListsById[id]
      var node = document.querySelector(selector)
      for(var i=0; i<colors.length; i++) {
        renderStroke(node, colors[i], bounds[i])
      }
    }

    function renderSwatch(color, bounds) {
      return element(
        element.style({
          "position": "absolute",
          "background": color,
          "left": bounds.minX+"px",
          "top": bounds.minY+"px",
          "width": (bounds.maxX - bounds.minX)+"px",
          "height": (bounds.maxY - bounds.minY)+"px",
        })
      )
    }

    function renderStroke(target, color, bounds) {

      var swatch = renderSwatch(color, bounds)

      if (Array.isArray(target)) {
        target.forEach(addStroke)
      } else {
        addStroke(target)
      }

      function addStroke(node) {
        addHtml.inside(node, swatch.html())
      }
    }


    htmlPainting.renderTo = function(id, selector) {
      var targets = renderTargets[id]
      if (!targets) {
        targets = renderTargets[id] = []
      }
      targets.push(document.querySelector(selector))
    }

    return htmlPainting
  }
)