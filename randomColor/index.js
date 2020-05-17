//Create array colors to take random color
const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
/*VARIABLE*/
// used to create random color
const color = document.getElementById("color");
const createBtn = document.getElementById("create");
//used to add favorite color
const addBtn = document.getElementById("add");
const collectList = document.querySelector(".collection__list"); //ul

/*Event*/
createBtn.addEventListener("click", generateColor);
addBtn.addEventListener("click", addColor);
collectList.addEventListener("click", dynamicFunction);

//generateColor function
function generateColor() {
  let hex = "#";
  for (let i = 0; i < 6; i++) {
    hex += colors[randomColor()];
  }
  // change body bg color
  document.body.style.background = hex;
  //document.body.style.background = `linear-gradient(to right, ${hex}, #000)`;
  //change text to show current color
  color.innerText = hex;
}

//get random color function
function randomColor() {
  return Math.floor(Math.random() * colors.length);
}

//addColor function
function addColor() {
  //create div tag
  let div = document.createElement("div");
  div.classList.add("collection__group");
  //create li tag
  let li = document.createElement("li");
  li.classList.add("color__name");
  li.textContent = color.innerText;
  //create button trash tag
  let button_del = document.createElement("button");
  button_del.setAttribute("class", "btn btn-trash", "title", "Delete");
  //create button demo
  let button_demo = document.createElement("button");
  button_demo.setAttribute("class", "btn btn-use", "title", "Demo this color");

  //Add tags together
  div.appendChild(li);
  div.appendChild(button_del);
  div.appendChild(button_demo);
  // add div to ul
  collectList.appendChild(div);

  //change bg-color of li
  li.style.background = color.innerText;
}

//removeColor function
function dynamicFunction(e) {
  if (e.target.classList.contains("btn-trash")) {
    e.target.parentElement.classList.add("fade__away");
  } else if (e.target.classList.contains("btn-use")) {
    let targetColor =
      e.target.previousElementSibling.previousElementSibling.innerText;
    document.body.style.background = targetColor;
  }
}
