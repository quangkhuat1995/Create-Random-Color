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
document.addEventListener("DOMContentLoaded", getColor);
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
  button_del.setAttribute("class", "btn btn-trash");
  button_del.setAttribute("title", "Delete");
  //create button demo
  let button_demo = document.createElement("button");
  button_demo.setAttribute("class", "btn btn-use");
  button_demo.setAttribute("title", "Demo this color");

  //Add tags together
  div.appendChild(li);
  div.appendChild(button_del);
  div.appendChild(button_demo);
  // add div to ul
  collectList.appendChild(div);

  //change bg-color of li
  li.style.background = color.innerText;
  //save color to localStorage
  saveLocalColor(color.innerText);
}

//removeColor and addColor function
function dynamicFunction(e) {
  //delete color from collection
  if (e.target.classList.contains("btn-trash")) {
    e.target.parentElement.classList.add("fade__away");
    //after transition end, remove the color ()
    e.target.parentElement.addEventListener("transitionend", () => {
      e.target.parentElement.remove();
    });
    removeLocalColor(e.target.parentElement.innerText);
  }
  //try back other color
  else if (e.target.classList.contains("btn-use")) {
    let targetColor =
      e.target.previousElementSibling.previousElementSibling.innerText;
    document.body.style.background = targetColor;
    //show the current color
    color.innerText = targetColor;
  }
}

//saveLocalStorge
function saveLocalColor(color) {
  //check if there are any in localStorge
  let colorArray;
  if (localStorage.getItem("colorArray") === null) {
    colorArray = [];
  } else {
    colorArray = JSON.parse(localStorage.getItem("colorArray"));
  }
  colorArray.push(color);
  localStorage.setItem("colorArray", JSON.stringify(colorArray));
}

//getColor from local Storage and show in UI
function getColor() {
  //check if there are any in localStorge
  let colorArray;
  if (localStorage.getItem("colorArray") === null) {
    colorArray = [];
  } else {
    colorArray = JSON.parse(localStorage.getItem("colorArray"));
  }
  colorArray.forEach((color) => {
    //create div tag
    let div = document.createElement("div");
    div.classList.add("collection__group");
    //create li tag
    let li = document.createElement("li");
    li.classList.add("color__name");
    li.textContent = color;
    //create button trash tag
    let button_del = document.createElement("button");
    button_del.setAttribute("class", "btn btn-trash");
    button_del.setAttribute("title", "Delete");
    //create button demo
    let button_demo = document.createElement("button");
    button_demo.setAttribute("class", "btn btn-use");
    button_demo.setAttribute("title", "Demo this color");

    //Add tags together
    div.appendChild(li);
    div.appendChild(button_del);
    div.appendChild(button_demo);
    // add div to ul
    collectList.appendChild(div);

    //change bg-color of li
    li.style.background = color;
  });
}

/*remove color from localStorage
@param: string: name of color, Ex. #fafafa*/
function removeLocalColor(color) {
  let colorArray;
  if (localStorage.getItem("colorArray") === null) {
    colorArray = [];
  } else {
    colorArray = JSON.parse(localStorage.getItem("colorArray"));
  }

  const colorIndex = colorArray.indexOf(color);
  colorArray.splice(colorIndex, 1);
  //update colorArray to localStorage after remove color
  localStorage.setItem("colorArray", JSON.stringify(colorArray));
}
