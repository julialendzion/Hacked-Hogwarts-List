"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let popup = document.querySelector("#popup");

const Student = {
  imageUrl: "",
  firstName: "",
  lastName: "",
  middleName: "",
  nickname: "",
  gender: "",
  house: "",
  bloodstatus: "",
  prefect: false,
  squad: false,
  expel: false,
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons --> function registerButtons
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
}

function loadJSON() {
  fetch(`https://petlatkea.dk/2021/hogwarts/students.json`)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  // TODO: Add filtering here !!! This might not be the function we want to call first
  console.log(allStudents);
  displayList(allStudents);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student); // new object with cleaned data

  student.firstName = getStudentsName(jsonObject.fullname.trim());
  student.lastName = getStudentsLastName(jsonObject.fullname.trim());
  student.middleName = getStudentsMiddleName(jsonObject.fullname.trim());
  student.nickname = getStudentsNickname(jsonObject.fullname.trim());
  student.house = getHouse(jsonObject.house.trim());
  student.imageUrl = getImage(student.lastName, student.firstName);
  console.log(student);
  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  filterList(filter);
}

function filterList(house) {
  let filteredList = allStudents;
  if (house === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (house === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (house === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (house === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  }
  displayList(filteredList);
}

function isGryffindor(student) {
  return student.house === "Gryffindor"; // ---> to samo co warunek skrót!!
}

function isSlytherin(student) {
  return student.house === "Slytherin"; // ---> to samo co warunek skrót!!
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff"; // ---> to samo co warunek skrót!!
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw"; // ---> to samo co warunek skrót!!
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
  console.log(students);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=first-name]").textContent = student.firstName;
  clone.querySelector("[data-field=middle-name]").textContent = student.middleName;
  clone.querySelector("[data-field=last-name]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=first-name]").addEventListener("click", () => showPopUp(student));
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
// --> TO DO blood generate status
function showPopUp(student) {
  console.log("pop up");
  popup.classList.remove("hidden");

  popup.querySelector(".student_image").src = `img/${student.imageUrl}`;
  popup.querySelector(".name").textContent = ` ${student.firstName} ${student.middleName} ${student.lastName}`;

  popup.querySelector(".house").textContent = student.house;
  popup.querySelector(".blood").textContent = "blood status:";
  popup.querySelector(".prefect").textContent = "prefect or not:";
}

////// CLEANING THE DATA ////////

function getStudentsName(fullName) {
  const name = fullName.substring(0, fullName.indexOf(" "));
  const firstName = clean(name);
  return firstName;
}

function getStudentsLastName(fullName) {
  const last = fullName.slice(fullName.lastIndexOf(" ") + 1);
  const lastName = clean(last);
  return lastName;
}

function getStudentsMiddleName(fullName) {
  if (fullName.includes(" ") == true) {
    const middleSpace = fullName.slice(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
    const firstCharacter = middleSpace.slice(0, 1);
    if (firstCharacter !== '"') {
      const cleanMiddleName = clean(middleSpace);
      return cleanMiddleName;
    }
  }
}
function getHouse(dataHouse) {
  const house = clean(dataHouse);
  return house;
}

function getStudentsNickname(fullName) {
  const middleSpace = fullName.slice(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
  const firstCharacter = middleSpace.slice(0, 1);
  if (firstCharacter === '"') {
    length = middleSpace.length;
    const nickNameWithoutQuotes = middleSpace.slice(1, length - 1);
    // console.log(nickNameWithoutQuotes);
    const cleanNickName = clean(nickNameWithoutQuotes);
    return cleanNickName;
  }
}

function getImage(lastname, firstname) {
  // lastname_firstletteroffirstname.png

  if (lastname !== undefined) {
    const smallLastName = lastname.toLowerCase();
    const smallFirstName = firstname.toLowerCase();
    const firstLetterOfFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname == "Patil") {
      const imageSrc = `${smallLastName}_${smallFirstName}.png`;
      return imageSrc;
    } else if (lastname.includes("-") == true) {
      const partOfLastNameAfterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imageSrc = `${partOfLastNameAfterHyphen}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    } else {
      const imageSrc = `${smallLastName}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    }
  }
}

function clean(name) {
  const firstLetter = name.slice(0, 1).toUpperCase();
  const restOfName = name.slice(1).toLowerCase();
  const cleanName = firstLetter + restOfName;
  return cleanName;
}
