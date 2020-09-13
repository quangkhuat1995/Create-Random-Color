//Create array colors to take random color
const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
/*VARIABLE*/
const choice = document.getElementById("mode"); //select
// used to create random color
const color = document.getElementById("color");
const colorPri = document.getElementById("colorPri");
const colorSec = document.getElementById("colorSec");
const collectList = document.querySelectorAll(".collection__list"); //ul
const contentGroup = document.querySelectorAll(".content");
const btns = document.querySelectorAll("button.btn");

/*EVENTs*/
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
      // lastNormal = colorArr.pop();
      // lastLinear = [colorPriArr.pop(), colorSecArr.pop()];
      // console.log(lastNormal);
      // console.log(lastLinear);
    }
  })
);
let lastNormal = null;
let lastLinear = [];

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
  /**
   * test
   */
  let contentHTML = `
  <div class="collection__group">
    ${displayLiTag(elem)}
    <button class="btn btn-trash" title="Delete" data-target=${
      elem.dataset.target
    }></button>
    <button class="btn btn-use" title="Demo this color" data-target=${
      elem.dataset.target
    }></button>
  </div>
  `;
  // TODO: data-target cua btn xoa, demo
  switch (elem.dataset.target) {
    case "normal":
      collectList[0].innerHTML += contentHTML;
      break;
    case "linear":
      collectList[1].innerHTML += contentHTML;
      break;
  }
}
function displayLiTag(elem) {
  let liTag = "";
  switch (elem.dataset.target) {
    case "normal":
      //if add class for the 2nd <li> will cause unwanted display style
      liTag = `
      <li style="background:${color.innerText}" class="color__name">${color.innerText}</li>
      <li></li>
      `;
      break;
    case "linear":
      liTag = `
      <li style="background:${colorPri.innerText}" class="color__name">${colorPri.innerText}</li>
      <li style="background:${colorSec.innerText}" class="color__name">${colorSec.innerText}</li>
      `;
      break;
  }
  return liTag;
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
    let li1Text = li1.innerText;
    let li2Text = li2.innerText;
    //delete color from collection
    if (e.target.classList.contains("btn-trash")) {
      collectionGroup.classList.add("fade__away");
      //after transition end, remove the color ()
      collectionGroup.addEventListener("transitionend", () => {
        collectionGroup.remove();
      });

      /*REMOVE COLOR FORM localStorage also*/
      removeLocalColor(li1Text, li2Text);
      //show the new last color
      checkBgColor(e.target.dataset.target, "normal");
    }
    //try back other color
    else if (e.target.classList.contains("btn-use")) {
      if (e.target.dataset.target == "linear") {
        document.body.style.background = `linear-gradient(to right,${li1Text}, ${li2Text})`;
        //show the primary and secondary color
        colorPri.innerHTML = li1Text;
        colorSec.innerHTML = li2Text;
      } else {
        document.body.style.background = li1Text;
        //show the current color
        color.innerHTML = li1Text;
      }
    }
  })
);

/*SELECT MODE TO CHANGE THE DISPLAY MODE*/
//choose mode to display onchange of select box
function chooseMode(e) {
  // checkLocalStorage();
  contentGroup.forEach((content) => {
    let dataMode = content.dataset.mode;
    if (e.target.value == dataMode) {
      content.classList.add("content-show");
    } else {
      content.classList.remove("content-show");
      // console.log(colorSecArr);
      // console.log(colorPriArr);
      console.log(colorArr);
    }
    //set background onchange

    checkBgColor(e.target.value, "normal-mode");
    // checkBgColor(e.target.value, "linear-mode");
  });
}
//display the last added color of each mode
function checkBgColor(valueMode, compareMode) {
  // if (colorArr.length === 0) return;
  // if (colorPriArr.length === 0 || colorSecArr.length === 0) return;

  if (valueMode === compareMode) {
    //change bgColor
    document.body.style.background = colorArr.slice(-1)[0] || "#7C5050";
    //change text info
    color.innerHTML = colorArr.slice(-1)[0] || "#7C5050";
  } else {
    document.body.style.background = `linear-gradient(to right,${
      colorPriArr.slice(-1)[0]
    }, ${colorSecArr.slice(-1)[0]})`;

    colorPri.innerHTML = colorPriArr.slice(-1)[0] || "#7C5050";
    colorSec.innerHTML = colorSecArr.slice(-1)[0] || "#7C5050";
  }
}

/*SAVE THE ADDED COLOR TO LOCALSTORAGE*/
//@param: string: color normal, color pri, color sec, element: element use to distinguish wich mode u are on.
function saveColorToLocal(hexColor, hexColorPri, hexColorSec, element) {
  checkLocalStorage();
  /* To make sure we dont add Pri and Sec color in to theirs Array when in normal mode and vice versa. Push color to its relative array*/
  if (element.dataset.target != "linear") {
    colorArr.push(hexColor);
  } else {
    colorPriArr.push(hexColorPri);
    colorSecArr.push(hexColorSec);
  }
  /*set Initial aray in local storage*/
  localStorage.setItem("colorArr", JSON.stringify(colorArr));
  localStorage.setItem("colorPriArr", JSON.stringify(colorPriArr));
  localStorage.setItem("colorSecArr", JSON.stringify(colorSecArr));
}

/*GET THE DATA FROM LOCALSTORAGE TO SHOW IN UI AFTER REFRESH PAGE*/
function getLocalColor() {
  checkLocalStorage();
  // Get color for normal mode
  let contentHTML = "";
  colorArr.forEach((colorName) => {
    contentHTML = `
    <div class="collection__group">
      <li class="color__name" style="background:${colorName}">${colorName}</li>
      <li></li>
      <button class="btn btn-trash" title="Delete" data-target="normal"></button>
      <button class="btn btn-use" title="Demo this color" data-target="normal"></button>
    </div>
  `;

    if (contentGroup[0].dataset.mode == "normal-mode") {
      collectList[0].innerHTML += contentHTML;
    }
  });

  // Get color for linear mode
  colorPriArr.forEach((colorPriName, index) => {
    contentHTML = `
      <div class="collection__group">
        <li class="color__name" style="background:${colorPriName}">${colorPriName}</li>
        <li class="color__name" style="background:${colorSecArr[index]}">${colorSecArr[index]}</li>
        <button class="btn btn-trash" title="Delete" data-target="linear"></button>
        <button class="btn btn-use" title="Demo this color" data-target="linear"></button>
      </div>
    `;
    if (contentGroup[1].dataset.mode == "linear-mode") {
      collectList[1].innerHTML += contentHTML;
    }
  });

  //show the latest bg after load
  checkBgColor(contentGroup[0].dataset.mode, "normal-mode");
}

/*REMOVE COLOR FROM LOCALSTORAGE WHEN CLICK DELETE*/
//@param: string, string : color want to del
function removeLocalColor(colorLi1, colorLi2) {
  checkLocalStorage();
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
let colorArr;
let colorPriArr;
let colorSecArr;
function checkLocalStorage() {
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
