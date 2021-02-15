let selected = {innerHTML: undefined};

let buttonList = document.getElementsByClassName("button");
for (let i = 0; i < buttonList.length; i ++) {
  document.getElementById(buttonList[i].id).setAttribute("onclick", "buttonClick('"+buttonList[i].id+"')");
}
//ceil(width/40)*gridSize, ceil(height/40)*gridSize

function buttonClick(id) {
  let buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i ++) {
    buttons[i].removeAttribute("selected");
  }
  document.getElementById(id).setAttribute("selected", "true");
  selected = document.getElementById(id)
  if (selected.innerHTML=="Center") {

    offset.one.x = width/2-(ceil(width/40)*gridSize)/2,
    offset.one.y = height/2-(ceil(height/40)*gridSize)/2
  }
}
