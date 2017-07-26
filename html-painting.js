var library = require("module-library")(require)

module.exports = library.export(
  "html-painting",
  ["identifiable"],
  function(identifiable) {
    var ids = {}
    var colorListsById = {}
    var boundsListsById = {}
    var originsById = {}
    var sizesById = {}
    var zoomsById = {}

    function htmlPainting(id) {
      if (ids[id]) {
        throw new Error("Already created html painting "+id)
      }
      id = identifiable.assignId(ids)
      return id
    }

    htmlPainting.stroke = function(id, color, bounds) {
      if (!colorListsById[id]) {
        colorListsById[id] = []
        boundsListsById[id] = []
      }

      colorListsById[id].push(color)
      boundsListsById[id].push(color)
    }

    return htmlPainting
  }
)