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
      var top = bounds.minY
      var height = bounds.maxY - bounds.minY

      if (bounds.minZ != null) {
        var left = bounds.x + bounds.minZ
        var width = bounds.maxZ - bounds.minZ
        var transform = "skew(0deg, 15deg)"
        var origin = "0% 0%"

      } else {
        var left = bounds.minX
        var width = bounds.maxX - bounds.minX
      }

      var styles = {
        "position": "absolute",
        "background": color,
        "left": left+"px",
        "top": top+"px",
        "width": width+"px",
        "height": height+"px",
      }

      if (transform) {
        styles["transform"] = transform
        styles["transform-origin"] = origin
      }

      return element(
        element.style(styles))
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