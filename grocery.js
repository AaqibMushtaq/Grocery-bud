//select itmes
const Form = document.querySelector(".grocery-from");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery"); //input-text field
const submitBtn = document.querySelector(".submit-btn");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//edit option\
let editElement;
console.log(editElement);
let editFlag = false; //its for edit button(three option of edit the item to the list..when we submit the form..  1)if we not edit mnz editflag is False 2)if we edit the it is true...3) if the user hasnt edit any kind of value
console.log(editFlag);
let editID = ""; //empty string and use in order to get sepecfic item

//addEventListener
//**********************************Submit form***************************
Form.addEventListener("submit", addItems);
//clear item
clearBtn.addEventListener("click", clearItems);
//load items
window.addEventListener("DOMContentLoaded", setupItems);
//*****************************************Functions***********************************
//first function starts##
function addItems(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString(); // use for get unique id but not good practice ..........  input have unique id
  //######################################First if start#############################
  if (value && !editFlag) {
    createListItems(id, value); // funtion from setup
    //display item
    displayAlert(`Item Added To The List`, `success`);
    //show container
    groceryContainer.classList.add("show-container"); // its shows the containeer
    //add to local
    addTOLocalStorage(id, value);
    //set to default
    setBackToDefault();
  } // if this is true    we add item to the list
  //#########################################if Ends######################
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value change", "success");
    //edit local storage
    editLocalStorage(editID, value); /// local storage its a function which is called hhere
    setBackToDefault();
    console.log("edditing");
  } // if this is true.... it is active when if we want to edit the item
  else {
    displayAlert("Please Enter Value", "danger");
  } // when the input section is empty
}
//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove Alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// Clear item
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      groceryList.removeChild(item);
    });
  }
  groceryContainer.classList.remove("show-container");
  displayAlert("Empty List", "danger");
  setBackToDefault();
  localStorage.removeItem("groceryList"); // it remove the items from localstorage by remove item code which is of grocerylist
}
//*******************del function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  groceryList.removeChild(element);
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }

  setBackToDefault();
  displayAlert("Item Removed", "danger");
  // remove form local storage
  removeFromLocalstorage(id);
  console.log("deleteitem");
  //e to acess parent cntainer
}

//*******************edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit elment
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //*******************************************************************set from value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}
console.log("edititem");
//******************************************************set back to default
function setBackToDefault() {
  grocery.value = "";
  editID = "";
  editFlag = false;
  submitBtn.textContent = "Submit";
  console.log("setback to default");
}
//local storage   add item to localstorage
function addTOLocalStorage(id, value) {
  const groceryItem = { id, value };
  console.log(groceryItem, "id and vlue which is stored in groceryItems");
  let items = getLocalStorage();
  console.log(items, "it have a function getlocalstorage");
  items.push(groceryItem);
  localStorage.setItem("groceryList", JSON.stringify(items));
  console.log("add to local storage", value);
}
// remove item localstorage
function removeFromLocalstorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
}
// edit item of  localstorage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("groceryList", JSON.stringify(items));
}
// function for get localstorage make code short and easy
function getLocalStorage() {
  return localStorage.getItem("groceryList")
    ? JSON.parse(localStorage.getItem("groceryList"))
    : [];
}
//local stroage APi
//setitem
//getitem
//removeitem
//savea as string
//**************setup items**************
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value);
    });
    groceryContainer.classList.add("show-container");
  }
}
// article container function
function createListItems(id, value) {
  const element = document.createElement("article");
  //add class of article(grocery-items)
  element.classList.add("grocery-item");
  //add id
  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.innerHTML = `
   <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="del-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  //edit&del buttion
  const deleteBtn = element.querySelector(".del-btn");
  const editbtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editbtn.addEventListener("click", editItem);
  //apend child
  groceryList.appendChild(element);
}
