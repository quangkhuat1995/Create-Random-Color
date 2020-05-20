//Create array colors to take random color
const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
/*VARIABLE*/
// used to create random color
const color = document.getElementById("color");
const colorPri = document.getElementById("colorPri");
const colorSec = document.getElementById("colorSec");
//distinguish each content (mode) by data-mode
const contentGroup = document.querySelectorAll(".content");
const collectList = document.querySelectorAll(".collection__list"); //ul
const choice = document.getElementById("mode"); //select
//To add "create color" or "add to collection" events
const btns = document.querySelectorAll("button.btn");

/*Event*/
choice.addEventListener("change", chooseMode);
document.addEventListener("DOMContentLoaded", getLocalColor);

/*CHANGE BACKGROUND COLOR AND ADD TO COLLECTION ON CLICK*/
btns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    let btn = e.target;
    if (btn.classList.contains("create")) {
      let myHexColorArr = generateColor();
      switch (btn.dataset.target) {
        case "normal":
          document.body.style.background = myHexColorArr[0];
          color.innerText = myHexColorArr[0];
          break;
        case "linear":
          colorPri.innerText = myHexColorArr[1];
          colorSec.innerText = myHexColorArr[2];

          //console.log("Tu tu lam cho to right");
          document.body.style.background = `linear-gradient(to right, ${myHexColorArr[1]}, ${myHexColorArr[2]})`;
          break;
      }
    } else if (btn.classList.contains("add")) {
      addColor(btn);
      //save color to localStorage
      saveColorToLocal(
        color.innerText,
        colorPri.innerText,
        colorSec.innerText,
        btn
      );
    }
  })
);

//generateColor function
//@Output Array of color [hex, hexPri, hexSec]
function generateColor() {
  let hex = "#";
  let hexPri = "#";
  let hexSec = "#";
  for (let i = 0; i < 6; i++) {
    hex += colors[randomColor()];
    hexPri += colors[randomColor()];
    hexSec += colors[randomColor()];
  }
  return [hex, hexPri, hexSec];
}
//addColor function
/*@param elem: string, an element tag
 *        color: string, color of normal mode
 *        colorPri: string, color of Linear mode
 *        colorSec: string, color of Linear mode
 *@output: create element tag*/
function addColor(elem) {
  //create div tag
  let div = document.createElement("div");
  div.classList.add("collection__group");
  //create li tag
  let li1 = document.createElement("li");
  li1.classList.add("color__name");

  //create button trash tag
  let button_del = document.createElement("button");
  button_del.setAttribute("class", "btn btn-trash");
  button_del.setAttribute("title", "Delete");
  //create button demo
  let button_demo = document.createElement("button");
  button_demo.setAttribute("class", "btn btn-use");
  button_demo.setAttribute("title", "Demo this color");

  //Add tags together
  div.appendChild(li1);
  // div.appendChild(li2);
  div.appendChild(button_del);
  div.appendChild(button_demo);
  //create li2 tag(seccondary color)
  let li2 = document.createElement("li");
  switch (elem.dataset.target) {
    case "normal":
      li1.textContent = color.innerText;
      //khong add class cho li2 de width=0 (li1 co flex:1)
      li2.textContent = "";
      //change bg-color of li
      li1.style.background = color.innerText;
      collectList[0].appendChild(div);
      break;
    case "linear":
      li1.textContent = colorPri.innerText;
      li2.textContent = colorSec.innerText;
      li2.classList.add("color__name");
      li1.style.background = colorPri.innerText;
      li2.style.background = colorSec.innerText;
      button_demo.setAttribute("data-target", "linear");
      button_del.setAttribute("data-target", "linear");
      collectList[1].appendChild(div);
      break;
  }
  // add li2 to div
  div.insertBefore(li2, button_del);
}
//get random color function
function randomColor() {
  return Math.floor(Math.random() * colors.length);
}
/*DELETE OR DEMO THE COLLECTED COLOR*/
collectList.forEach((list) =>
  list.addEventListener("click", (e) => {
    let collectionGroup = e.target.parentElement;
    let li1 = collectionGroup.firstElementChild;
    let li2 = li1.nextElementSibling;
    //delete color from collection
    if (e.target.classList.contains("btn-trash")) {
      collectionGroup.classList.add("fade__away");
      //after transition end, remove the color ()
      collectionGroup.addEventListener("transitionend", () => {
        collectionGroup.remove();
      });
      /*REMOVE COLOR FORM localStorage also*/
      removeLocalColor(li1.innerText, li2.innerText);
    }
    //try back other color
    else if (e.target.classList.contains("btn-use")) {
      if (e.target.dataset.target == "linear") {
        document.body.style.background = `linear-gradient(to right,${li1.innerText}, ${li2.innerText})`;
        //show the primary and secondary color
        colorPri.innerText = li1.innerText;
        colorSec.innerText = li2.innerText;
      } else {
        document.body.style.background = li1.innerText;
        //show the current color
        color.innerText = li1.innerText;
      }
    }
  })
);

/*SAVE THE ADDED COLOR TO LOCALSTORAGE*/
//@param: string: color normal, color pri, color sec, element: element use to distinguish wich mode u are on.
function saveColorToLocal(hexColor, hexColorPri, hexColorSec, element) {
  //check if there are any in localStorge
  let [colorArr, colorPriArr, colorSecArr] = checkLocalStorage();
  /* To make sure we dont add Pri and Sec color in to theirs Array when in normal mode and vice versa. Push color to its relative array*/
  if (element.dataset.target != "linear") {
    colorArr.push(hexColor);
  } else {
    colorPriArr.push(hexColorPri);
    colorSecArr.push(hexColorSec);
  }

  localStorage.setItem("colorArr", JSON.stringify(colorArr));
  localStorage.setItem("colorPriArr", JSON.stringify(colorPriArr));
  localStorage.setItem("colorSecArr", JSON.stringify(colorSecArr));
}

/*GET THE DATA FROM LOCALSTORAGE TO SHOW IN UI AFTER REFRESH PAGE*/
function getLocalColor() {
  //check if there are any in localStorge
  let [colorArr, colorPriArr, colorSecArr] = checkLocalStorage();

  // Get color for normal mode
  colorArr.forEach((colorName) => {
    //create div tag
    let div = document.createElement("div");
    div.classList.add("collection__group");
    //create li tag
    let li1 = document.createElement("li");
    li1.classList.add("color__name");

    //create button trash tag
    let button_del = document.createElement("button");
    button_del.setAttribute("class", "btn btn-trash");
    button_del.setAttribute("title", "Delete");
    //create button demo
    let button_demo = document.createElement("button");
    button_demo.setAttribute("class", "btn btn-use");
    button_demo.setAttribute("title", "Demo this color");

    //Add tags together
    div.appendChild(li1);
    // div.appendChild(li2);
    div.appendChild(button_del);
    div.appendChild(button_demo);
    //create li2 tag(seccondary color)
    let li2 = document.createElement("li");
    if (contentGroup[0].dataset.mode == "normal-mode") {
      li1.textContent = colorName;
      //khong add class cho li2 de width=0 (li1 co flex:1)
      li2.textContent = "";
      //change bg-color of li
      li1.style.background = colorName;
      collectList[0].appendChild(div);
    }
    // add li2 to div
    div.insertBefore(li2, button_del);
  });
  // Get color for linear mode
  colorPriArr.forEach((colorPriName) => {
    //create div tag
    let div = document.createElement("div");
    div.classList.add("collection__group");
    //create li tag
    let li1 = document.createElement("li");
    li1.classList.add("color__name");

    //create button trash tag
    let button_del = document.createElement("button");
    button_del.setAttribute("class", "btn btn-trash");
    button_del.setAttribute("title", "Delete");
    //create button demo
    let button_demo = document.createElement("button");
    button_demo.setAttribute("class", "btn btn-use");
    button_demo.setAttribute("title", "Demo this color");

    //Add tags together
    div.appendChild(li1);
    // div.appendChild(li2);
    div.appendChild(button_del);
    div.appendChild(button_demo);
    //create li2 tag(seccondary color)
    let li2 = document.createElement("li");
    if (contentGroup[1].dataset.mode == "linear-mode") {
      li1.textContent = colorPriName;
      li1.style.background = colorPriName;
      button_demo.setAttribute("data-target", "linear");
      button_del.setAttribute("data-target", "linear");
      colorSecArr.some((colorSecName) => {
        li2.textContent = colorSecName;
        li2.classList.add("color__name");
        li2.style.background = colorSecName;
        colorSecArr.shift();
        return true;
      });

      collectList[1].appendChild(div);
    }
    // add li2 to div
    div.insertBefore(li2, button_del);
  });
}

/*REMOVE COLOR FROM LOCALSTORAGE WHEN CLICK DELETE*/
//@param: string, string : color want to del
function removeLocalColor(colorLi1, colorLi2) {
  let [colorArr, colorPriArr, colorSecArr] = checkLocalStorage();
  let colorIndexLi1;
  let colorIndexLi2;
  contentGroup.forEach((content) => {
    if (
      content.classList.contains("content-show") &&
      content.dataset.mode == "normal-mode"
    ) {
      colorIndexLi1 = colorArr.indexOf(colorLi1);
      colorArr.splice(colorIndexLi1, 1);
      //update colorArr to localStorage after remove color
      localStorage.setItem("colorArr", JSON.stringify(colorArr));
    } else if (
      content.classList.contains("content-show") &&
      content.dataset.mode == "linear-mode"
    ) {
      colorIndexLi1 = colorPriArr.indexOf(colorLi1);
      colorPriArr.splice(colorIndexLi1, 1);
      //update colorPriArr to localStorage after remove color
      localStorage.setItem("colorPriArr", JSON.stringify(colorPriArr));

      colorIndexLi2 = colorSecArr.indexOf(colorLi2);
      colorSecArr.splice(colorIndexLi2, 1);
      //update colorSecArr to localStorage after remove color
      localStorage.setItem("colorSecArr", JSON.stringify(colorSecArr));
    }
  });
}

//Small func to check if the local storage have anything inside
//output: 3 arrays (from localStorage) contain colors with its relative mode
function checkLocalStorage() {
  let colorArr;
  let colorPriArr;
  let colorSecArr;
  /*CHECK IF THE LOCALSTORAGE IS AVAILABLE, if there is, parse it back to its relative array*/
  if (localStorage.getItem("colorArr") === null) {
    colorArr = [];
  } else {
    colorArr = JSON.parse(localStorage.getItem("colorArr"));
  }

  if (localStorage.getItem("colorPriArr") === null) {
    colorPriArr = [];
  } else {
    colorPriArr = JSON.parse(localStorage.getItem("colorPriArr"));
  }

  if (localStorage.getItem("colorSecArr") === null) {
    colorSecArr = [];
  } else {
    colorSecArr = JSON.parse(localStorage.getItem("colorSecArr"));
  }
  return [colorArr, colorPriArr, colorSecArr];
}

/*SELECT MODE TO CHANGE THE DISPLAY MODE*/
//choose mode to display onchange of select box
function chooseMode(e) {
  contentGroup.forEach((content) => {
    let dataMode = content.dataset.mode;
    if (e.target.value == dataMode) {
      content.classList.add("content-show");
      //For Inspect view to know which mode is on
      document.body.dataset.target = "linear";
    } else {
      content.classList.remove("content-show");
      //For Inspect view
      document.body.dataset.target = "normal";
    }
  });
}
