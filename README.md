**html-painting** captures a painting as different colored DIVs so that it can be played back when a web page loads:

```javascript
var htmlPainting = require("html-painting")

htmlPainting("picasso")
htmlPainting.stroke("picasso", "red", {
  minX: 48,
  maxX: 72,
  minY: 190,
  maxY: 288})

htmlPainting.playBackInto("picasso", "body")
```
