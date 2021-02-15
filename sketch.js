let shapes = [
]
let removed = [
]
let zoom = {real: 0, effect: 0}
let offset = {
  one: {
    x: 0,
    y: 0
  },
  two: {
    x: 0,
    y: 0
  }
}
let gridSize = 0
let currentShape = {}

document.onkeydown = KeyPress;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight-28);
  canvas.parent('canvasContainer')
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight-28)
}

function draw() {
  rectMode(CORNER)
  background(46, 46, 46)
  zoom.real = constrain(zoom.real, -10, 1000)
  zoom.effect += (zoom.real-zoom.effect)/4
  gridSize = 40+zoom.effect
  offset.one.x = constrain(offset.one.x, -0.5*grid().width, 0.5*grid().width)
  offset.one.y = constrain(offset.one.y, -0.5*grid().height, 0.5*grid().height)
  drawGrid()
  //draw all the shapes
  for (let i = 0; i < shapes.length; i ++) {
    drawShape(shapes[i])
  }

  if (mouseIsPressed&&selected.innerHTML=="Pen"&&mouseButton==LEFT) {
    drawShape(currentShape)
  }
  noStroke()
  fill(0,0,0)
}

function mousePressed() {
  currentShape = {
    curve: true,
    stroke: {
      weight: 10,
      cap: "round",
      join: "round",
      color: {
        mode: "rgba",
        red: 0,
        green: 0,
        blue: 0,
        alpha: 255
      }
    },
    fill: {
      color: {
        mode: "rgba",
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
      }
    },
    points: [
      {x: mouse().x, y: mouse().y}
    ]
  }
}

function mouse() {
  return {
    x: map(mouseX, grid().x, grid().x+grid().width, 0, grid().w),
    y: map(mouseY, grid().y, grid().y+grid().height, 0, grid().h)
  }
}

function grid() {
  return {
    width: (ceil(width/40)*gridSize),
    height: (ceil(height/40)*gridSize),
    w: ceil(width/40)*40,
    h: ceil(height/40)*40,
    x: offset.two.x+offset.one.x,
    y: offset.two.y+offset.one.y
  }
}

function drawShape(shape) {
  beginShape()
  stroke(shape.stroke.color.red,
        shape.stroke.color.green,
        shape.stroke.color.blue,
        shape.stroke.color.alpha)
  if (shape.stroke.cap) {
    if (shape.stroke.cap=="round") {
      strokeCap(ROUND)
    }
    if (shape.stroke.cap=="square") {
      strokeCap(SQUARE)
    }
    if (shape.stroke.cap=="project") {
      strokeCap(PROJECT)
    }
  }else{
    strokeCap(ROUND)
  }
  if (shape.stroke.join) {
    if (shape.stroke.join=="round") {
      strokeJoin(ROUND)
    }
    if (shape.stroke.join=="miter") {
      strokeJoin(MITER)
    }
    if (shape.stroke.join=="bevel") {
      strokeJoin(BEVEL)
    }
  }else{
    strokeJoin(ROUND)
  }
  strokeWeight(shape.stroke.weight*(1+zoom.effect/40))
  fill(shape.fill.color.red,
        shape.fill.color.green,
        shape.fill.color.blue,
        shape.fill.color.alpha)
  if (!shape.curve) {
    for (let p = 0; p < shape.points.length; p ++) {
      vertex(offset.two.x+offset.one.x+shape.points[p].x*(1+zoom.effect/40), offset.two.y+offset.one.y+shape.points[p].y*(1+zoom.effect/40))
    }
  }else{
    curveVertex(offset.two.x+offset.one.x+shape.points[0].x*(1+zoom.effect/40), offset.two.y+offset.one.y+shape.points[0].y*(1+zoom.effect/40))
    for (let p = 0; p < shape.points.length; p ++) {
      curveVertex(offset.two.x+offset.one.x+shape.points[p].x*(1+zoom.effect/40), offset.two.y+offset.one.y+shape.points[p].y*(1+zoom.effect/40))
    }
    curveVertex(offset.two.x+offset.one.x+shape.points[shape.points.length-1].x*(1+zoom.effect/40), offset.two.y+offset.one.y+shape.points[shape.points.length-1].y*(1+zoom.effect/40))
  }
  endShape()
}

function drawGrid() {
  let mousePos = {x: floor((mouseX-offset.one.x-offset.two.x)/gridSize), y: floor((mouseY-offset.one.y-offset.two.y)/gridSize)}
  stroke(0,0,0)
  fill(222, 222, 222)
  strokeWeight(5)
  rect(offset.two.x+offset.one.x, offset.two.y+offset.one.y, ceil(width/40)*gridSize, ceil(height/40)*gridSize)
  noStroke()
  // to remove border glitch
  rect(offset.two.x+offset.one.x, offset.two.y+offset.one.y, ceil(width/40)*gridSize, ceil(height/40)*gridSize)
  for (let y = 0; y < ceil(height/40); y ++) {
    for (let x = 0; x < ceil(width/40); x ++) {
      if (y % 2 == 0) {
        if (x % 2 == 0) {
        	fill(171, 171, 171)
        }
        else {
          fill(222, 222, 222)
        }
      }
      else {
        if (x % 2 == 0) {
        	fill(222, 222, 222)
        }
        else {
          fill(171, 171, 171)
        }
      }
      rect(offset.two.x+offset.one.x+ x * gridSize, offset.two.y+offset.one.y+ y * gridSize, gridSize, gridSize);
    }
  }
}

function mouseWheel(event) {
  console.log(event.delta)
  let zoomNum = event.delta
  if (abs(event.delta)<70) {
    zoomNum = (event.delta/3)*100
  }
  zoom.real -= zoomNum/10
}

function mouseDragged() {
  if (mouseButton === CENTER) {
    offset.one.x += mouseX-pmouseX
    offset.one.y += mouseY-pmouseY
  }
  if (selected.innerHTML=="Pen"&&mouseButton==LEFT) {
    currentShape.points[currentShape.points.length] = {x: mouse().x, y: mouse().y}
  }
}

function mouseReleased() {
  if (selected.innerHTML=="Pen"&&mouseButton==LEFT) {
    shapes[shapes.length] = currentShape
  }
}

function KeyPress(e) {
  var evtobj = window.event? event : e
  if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
    if(shapes.length >= 1) {
      removed[removed.length] = shapes[shapes.length-1]
      shapes.splice(shapes.length-1, 1);
    }
  }
  if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
    if(removed.length >= 1) {
      shapes[shapes.length] = removed[0]
      removed.splice(0, 1);
    }
  }
}
