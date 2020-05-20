# Create-Random-Color

```
"Click more, click more until you're bored" - Me, the Unknown Poet.
```

My pet project. Find lucky favorite color by random.

If you like the colors you found, you can add them to your collection and they are saved in your browser localStorage. You can delete saved colors anytime.

## My Goal List

- [x] Make random color page on click event.
- [x] Make "add" function, display in the UI.
- [x] Deals with localStorage to save, get, remove colors.
- [x] Add Linear mode with same functions.
- [ ] Display bg-color with the lastest added color when reopen or refresh browser.
- [ ] Let user able to choose linear direction.(Input field or graphic way). Valid input form.
- [ ] Change bg-color with event "keyup". Right after Direction field is typed.
- [ ] \(Optional) Apply color to background of Text.
- [ ] \(Optional) Let user able to try their own combination color in linear mode. (User type in direction, primary color, secondary color).

## UPDATE MAY 20th 2020

### Legend

Add mode linear-gradient mode to create linear color to background. From now will be called **_linear mode_** and the non-linear background color called **_normal mode_**.

Mostly I use data-target = ["normal", "linear"] or data-mode on some tags to distinguish mode (short term for distinguish which mode is display in UI).

Because linear mode need 2 colors, but normal mode only need 1 so there are 2 main differences UI in normal mode and linear mode. First is the color info, which tell us what color currently display. Last but not least is the way the added color display. (see the HTML comment for more clarification).

### How I code

### :one: **Switching display mode**

Add "change" event for dropdown box that will add class ".content-show" to display the content we choose.
Or we can say switching mode anytime we "change". By default, its class ".content" is display none.

### :two: **Generate random color and add to collection list**

Add "click" event on all button that have class ".btn" - document.queryselectorAll("button.btn");

Loop through each btn, depend on each btn className (add or create). **If (create)** {check the btn's data-target value(normal or linear), which we gave in the HTML to distinguiush mode, depend on its value mode, change the backgroundd color}.**else if(add)**{run function `addColor(elem)`, which will create HTML DOM depend on mode, @param Input is element(tag) that we use to distinguish mode, in this case is the btn that has class ".add" and also save colors into localStorage by function `saveColorToLocal(hexColor, hexColorPri, hexColorSec, element)`, in this case the `element` is the btn with class ".add", details of this function will be mentioned later}.

### :three: **Delete saved color (also delete it from localStorage) and demo saved color**

Because these buttons (btn-trash and btn-use) are generically created by `addColor()` function so we access them from there parents (ul tag) const collectList = document.querySelectorAll(ul.collection\_\_list) so

|                    |                               |
| ------------------ | ----------------------------- |
| **collectList[0]** | parent of btns in normal mode |
| **collectList[1]** | parent of btns in linear mode |

Give "click" event forEach collectList.

- The delete function is the the same in 2 mode, give class (.fade-away) then remove div by `remove()` method. And also remove color from localStorage by function `removeLocalColor(li1Text,li2Text)` - mentioned later.
- For demo function, we have to check attribute data-target of the btn we click to distinguish mode. The data-target of the btn is added in `addColor(elem)` function (while we created it, we also give it attribute data-target by `setAttribute()` method)

### :four: **My collection still there after I refresh the page**

To do this we need to do **3** things:

1. Save colors'name in to array and put them into localStorage by `saveColorToLocal(...)` function. We need 3 array of colors:

- _colorArr_ for normal mode;
- _colorPriArr_ (stands for Primary color) for linear mode;
- _colorSecArr_ (stands for Secondary color) also for linear mode;

2. After the page loaded (refresh or open), take the colors from localStorage and display in UI, depend on which mode is on. Using `getLocalColor()` function with "DOMContentLoaded" event on document.
3. We delete added color in the UI but also need to delete it from localStorge. Otherwise, thanks to `getLocalColor()`, It will just keep popping back all colors we saved everytime page reloaded. To do this we use `removeLocalColor(colorLi1,colorLi2)`
4. Oops! Did I said 3. This function is born to avoid me repeating myself. Everytime we access localStorage to modify (**_save, get, remove_**), we need to `checkLocalStorage()`. For example, before we **_save_** array of colors into localStorage, we need to check if there is already an array (in the localStorage) or not. If not, make an empty array then modify it, if there already is an array with some value of colors, then parse it out so we can modify (save, get, remove) the array. Of couse, after modified, we set the data back to localStorage by method `setItem()`. Ex. `localStorage.setItem("key", JSON.stringify(colorArr));`

:floppy_disk: **function saveColorToLocal(hexColor, hexColorPri, hexColorSec, element)**

@param: String hexColor: name of color that going to be saved in normal mode

String hexColorPri: name of color that going to be saved in linear mode

String hexColorSec: name of color that going to be saved in linear mode

element: We dont want the color of normal mode acidently saved into Array of linear mode, so we use this element data-target attribute to distinguish mode. Depend on the target(mode), those hexColorName will be pushed to its relative array.

:key: **function getLocalColor()**

The function of this function is generally the same with `addColor()`, create new DOM element. The differences are:
We have 2 mode, 3 array of colors and we want to send data of these 3 array in to its relateive mode. Remember we don't want to display our saved linear color in to normal mode.:no_good:

- For normal mode: It's easy, just loop through the _colorArr_, forEach value in it (which is color's name), we create DOM and show them in normal mode. How do we know that we put them in normal mode? Remember the table above, just `appendChild()` all the DOM we created in this **collectList[0]**.
- For linear mode: We cant do the teachnic like normal mode because we have 2 array of color. If we loop through to 2 of them, we will create double DOM that we need. So I do a trick here, I use 1 forEach loop for the _colorPriArr_ like I did with _colorArr_, when it reach the stage to add attributes and contentText(contentText is the values from _colorSecArr_) for element(tag) that hold data of _colorSecArr_, I do a loop through _colorSecArr_ to get the value, but it only do the loop 1 times then `shift()` the first value out of _colorSecArr_ then `break`. Since forEach can not have `break`, I use `some()` to do the trick. At the end, we `appendChild()` all the DOM we created to **collectList[1]**.

:put_litter_in_its_place: **function removeLocalColor(colorLi1, colorLi2)**

@param: String colorLi1: name of color that going to be erased from colorArr and colorPriArr

String colorLi2: name of color that going to be erased from colorSecArr

This function is kicked off right after user clicks btn-trash, since both mode have this btn so we need to figure out how to distinguish the mode. We dont want to remove the colors of linear mode while we click the btn-trash in the normal mode and vice verse. So we need to check 2 conditions: data-mode and classList.contains("content-show"), this way the function will only be fired on the right mode that are being displayed.
