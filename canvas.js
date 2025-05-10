function Ab30(e) {
  for (var t = 3735928559, r = 0; r < 32; r++) t = 65599 * t + e["charCodeAt"](t % e["length"]) >>> 0;
  return t;
}

let canvas = document.createElement("canvas")
canvas.width = 48
canvas.height = 16

let ctx = canvas.getContext("2d")
ctx.font = "14px serif"
ctx.fillText("龘ฑภ경",2,12)
ctx.shadowBlur = 2
ctx.showOffsetX = 1
ctx.showColor = "lime"
ctx.arc(8,8,8,0,2)
ctx.stroke()
console.log(Ab30(canvas.toDataURL()))