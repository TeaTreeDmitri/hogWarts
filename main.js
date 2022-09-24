//Todo Add expel are you sure?? pop up and animations
//Todo Add expel animations! Big red cross??
//Todo Add Finch Fetchley picture grab
//Todo Configure Error pop ups

"use strict"

//global variables
let studentNames;
let firstName;
let middleName;
let lastName;
let imageTag1;
let imageTag2;
let index = 0;

let foundStudent;


const settings = {
    filterBy: "all",
    searchBy: "all",
    sortBy: "name",
    sortDir: "asc"
}


//global objects
let allStudents = [];
let expelledStudents = [];
let hufflepuffPrefects = [];
let gryffindorPrefects = [];
let ravenclawPrefects = [];
let slytherinPrefects = [];

// create template for student data

const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    studentGender: "",
    studentImg1: "",
    studentImg2: "",
    houseName: "",
    bloodType: "",
    isPrefect: "",
    isInquisitor: "",
    isExpelled: "",
    studentId: ""
}

// *INITIALISE /////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", event => {
    initialise();
})


//fetch the data 

async function initialise() {
    await loadNames();
    await loadBlood();
    addButtons();
}

//add eventListeners 

function addButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));

}

//fetch names 
async function loadNames() {
    const nameData = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentNames = await nameData.json();

    // studentNames.forEach((data) => (data.index = index++))
    prepareObjects(studentNames);
}

//fetch images


//fetch blood status
async function loadBlood() {
    const bloodData = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
    const studentBlood = await bloodData.json();
    assignBlood(studentBlood);
}

function prepareObjects(names) {
    allStudents = names.map(prepareData);
    displayList(allStudents);
    // addClick();
}

// * DATA PROCESS/ The Model///////////////////////////////////////////////////////////////////////////////////

//clean up the name data 
function prepareData(el) {


    el.index = index++

    // trim whitespace from edges
    el.fullname = el.fullname.trim();

    //make all letters lower case
    el.fullname = el.fullname.toLowerCase();

    //return nickname betweens ""
    let nickName = el.fullname.substring(el.fullname.indexOf(`"`), el.fullname.lastIndexOf(`"`) + 1)

    //remove nickname from fullname
    el.fullname = el.fullname.replace(nickName, "");

    //tidy up nickname
    nickName = nickName.replaceAll(`"`, "");
    nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1);

    //replace double " " with " ";
    el.fullname = el.fullname.replaceAll("  ", " ");

    //capitalise first letter and first letter after " ";
    let fullNameArr = el.fullname.split(" ");

    for (let i = 0; i < fullNameArr.length; i++) {
        fullNameArr[i] = fullNameArr[i][0].toUpperCase() + fullNameArr[i].substring(1);
    }

    el.fullname = fullNameArr.join(" ");

    //capitalise first letter after "-";
    let fullNameArr2 = el.fullname.split("-");

    for (let i = 0; i < fullNameArr2.length; i++) {
        fullNameArr2[i] = fullNameArr2[i][0].toUpperCase() + fullNameArr2[i].substring(1);
    }

    el.fullname = fullNameArr2.join("-");

    //trim white space from start
    el.fullname = el.fullname.trimStart();

    //tidy up house name 
    el.house = el.house.replaceAll(`"`, "");
    let houseName = el.house.toLowerCase();
    houseName = houseName.trim();
    houseName = houseName.charAt(0).toUpperCase() + houseName.slice(1);

    //tidy up gender
    let studentGender = el.gender.toLowerCase();
    studentGender = studentGender.trim();
    studentGender = studentGender.charAt(0).toUpperCase() + studentGender.slice(1);


    //Separate names and add to variables
    let fullNameArr3 = el.fullname.split(" ");
    if (fullNameArr3.length > 2) {
        firstName = fullNameArr3[0];
        middleName = fullNameArr3[1];
        lastName = fullNameArr3[2];
    } else if (fullNameArr.length <= 2) {
        firstName = fullNameArr3[0];
        middleName = "null";
        lastName = fullNameArr3[1];
    } else if (fullNameArr3.length < 2) {
        firstName = fullNameArr3[0];
        middleName = "null"
        lastName = "null"
    };

    //associate images with students
    //BEWARE FORWARD SLASH BEFORE FILE NAME MIGHT BE NECESSARY DEPENDING ON FILE STRUCTURE
    if (lastName) {
        imageTag1 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase().charAt(0) + ".png";
        imageTag2 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
    } else {
        imageTag1 = "/assets/studentImg/default.jpeg"
    }


    //put variables into newobjects
    const student = Object.create(Student);
    student.firstName = firstName;
    student.lastName = lastName;
    student.middleName = middleName;
    student.nickName = nickName;
    student.house = houseName;
    student.gender = studentGender;
    student.studentId = index;
    student.studentImg1 = imageTag1;
    student.studentImg2 = imageTag2;
    student.isPrefect = ""

    return student;
}

//filter the data 
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("User selected: ", filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    // let filteredList = allStudents;
    if (settings.filterBy === "all") {
        filteredList = allStudents;
    } else if (settings.filterBy === "Prefects") {
        filteredList = allStudents.filter(isPref);
    } else if (settings.filterBy === "Gryffindor") {
        filteredList = allStudents.filter(isGryff);
    } else if (settings.filterBy === "Slytherin") {
        filteredList = allStudents.filter(isSlyth);
    } else if (settings.filterBy === "Ravenclaw") {
        filteredList = allStudents.filter(isRave);
    } else if (settings.filterBy === "Hufflepuff") {
        filteredList = allStudents.filter(isHuff);
    } else if (settings.filterBy === "Expelled") {
        filteredList = expelledStudents;
        displayList(expelledStudents);
    }
    return filteredList;
}
//filter by attending/expelled

//filter by house

function isGryff(item) {
    return item.house === "Gryffindor"
};

function isSlyth(item) {
    return item.house === "Slytherin"
};

function isRave(item) {
    return item.house === "Ravenclaw"
};

function isHuff(item) {
    return item.house === "Hufflepuff"
}

function isPref(item) {
    return item.isPrefect === "Prefect"
}



//filter by prefects

//filter by inquisitors


//sort the data
function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc"
    } else {
        event.target.dataset.sortDirection = "asc"
    }
    console.log("User selected: ", sortBy, sortDir);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();

}
//sort by first name / last name / house
function sortList(sortedList) {
    let direction;
    if (settings.sortDir === "desc") {
        direction = 1
    } else {
        direction = -1;
    };

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

//*DISPLAY FUNCTIONS /The View //////////////////////////////////////////////////////////////////////////////////////////////
//display the data 

function buildList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

function displayList(students) {
    //clear the list
    document.querySelector("#list tbody").innerHTML = "";

    //build a new list
    students.forEach(displayStudents)
}

function displayStudents(listItem) {
    //create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //set clone data 
    clone.querySelector("[data-field=firstName]").textContent = listItem.firstName;
    clone.querySelector("[data-field=lastName]").textContent = listItem.lastName;
    clone.querySelector("[data-field=houseName]").textContent = listItem.house;
    clone.querySelector(".studentRow").id = listItem.studentId;

    //print clone
    document.querySelector("#list tbody").appendChild(clone);
    document.querySelectorAll(".studentRow").forEach(button => button.addEventListener("click", displayStudentPage));
    addSearch()
}

//assign Blood Status

function assignBlood(bloodList) {

    const pureList = bloodList.pure;
    const halfList = bloodList.half;
    allStudents.forEach(findBlood)

    function findBlood(student) {
        lastName = student.lastName
        if (pureList.includes(lastName)) {
            student.bloodType = "Pure";
        } else if (halfList.includes(lastName)) {
            student.bloodType = "Half"
        } else student.bloodType = "Muggle"
    }
}




// activate search


function addSearch() {
    document.querySelector("#searchBar").addEventListener("keyup", setSearchTerm);
}

function setSearchTerm() {
    let searchTerm = document.querySelector("#searchBar").value;
    console.log(searchTerm);

    setSearch(searchTerm)
}

function setSearch(term) {
    settings.searchBy = term;
    console.log(term);
    displayResults();
}

function findMatches(allStuds) {
    allStuds = allStudents.filter(findMe);

    function findMe(student) {
        let stringValues = Object.values(student).toString();
        stringValues = stringValues.toLowerCase();
        return stringValues.includes(settings.searchBy)
    }
    return allStuds
}

function displayResults() {
    console.log("displayresults")
    const searchedList = findMatches(allStudents);
    displayList(searchedList)
}


// open student page 

function displayStudentPage(event) {
    let selectedId = event.target.parentElement.id;
    selectedId = parseInt(selectedId);
    findStudent(selectedId)
}

function findStudent(selectedId) {
    console.log("ID of chosen student is", selectedId)
    foundStudent = allStudents.find(hasID);

    function hasID(object) {
        console.log("compare: ", object.studentId);
        console.log("with: ", selectedId);
        if (object.studentId === selectedId) {
            return object.studentId
        }
    }

    console.log("Student to display is: ", foundStudent);
    populatePage(foundStudent)
}

//display student information

function populatePage(student) {
    console.log("populatePage");
    //Todo add Finch Fetchley picture grab
    document.querySelector("#studentTitle").textContent = student.firstName + " " + student.lastName;
    document.querySelector("#studentPic1").style.backgroundImage = "url(" + student.studentImg1 + ")";
    document.querySelector("#studentPic2").style.backgroundImage = "url(" + student.studentImg2 + ")";
    document.querySelector("#houseImg").src = "/assets/otherImg/" + student.house + ".jpg";
    document.querySelector("#spanFirst").textContent = student.firstName;
    document.querySelector("#prefectButton").textCotnent = "Make Prefect";


    //add blood
    document.querySelector("#bloodPoint").textContent = student.bloodType + "-Blood";

    //add prefect
    if (student.isPrefect) {
        document.querySelector("#prefectPoint").textContent = "Is a prefect"
    } else {
        document.querySelector("#prefectPoint").textContent = "Not a prefect"
    }

    //add span for attending #spanExpel
    //add span for blood type
    //add span for inquisition #spanInquisitor

    //set action event listeners
    document.querySelector("#expelButton").addEventListener("click", expel)
    document.querySelector("#prefectButton").addEventListener("click", makePrefect)
    //Todo Add expel are you sure?? pop up

    //set animations and effects
    setGlow(student)
}

function setGlow(student) {
    let box = document.querySelector("#houseImg");
    if (student.house === "Gryffindor") {
        box.style.boxShadow = "rgb(226, 51, 51) 2px 2px 20px 10px";
    } else if (student.house === "Slytherin") {
        box.style.boxShadow = "rgb(136, 225, 136) 2px 2px 20px 10px";
    } else if (student.house === "Ravenclaw") {
        box.style.boxShadow = "rgb(16, 49, 137) 2px 2px 20px 10px";
    } else if (student.house === "Hufflepuff") {
        box.style.boxShadow = "rgb(186, 122, 28) 1px 1px 20px 10px";
    }

}


//expel function

function expel() {
    console.log("ID of expelled student is", foundStudent.studentId);
    let expelledStudent = allStudents.find(hasID);

    function hasID(object) {
        console.log("compare: ", object.studentId);
        console.log("with: ", foundStudent.studentId);
        if (object.studentId === foundStudent.studentId) {
            return object.studentId;
        }
    }

    console.log("Student to display is: ", expelledStudent);
    addExpelled(expelledStudent);
}

function addExpelled(student) {
    expelledStudents.push(student);
    removeExpelled(student)
}

function removeExpelled(student) {
    let removeMe = student.studentId - 1
    allStudents.splice(removeMe, 1);
    displayList(allStudents);
}
// Prefects

function makePrefect() {
    let studentNumber = foundStudent.studentId - 1;
    let houseArray = [];
    let prefect = allStudents[studentNumber]
    if (foundStudent.house === "Hufflepuff") {
        houseArray = hufflepuffPrefects;
    } else if (foundStudent.house === "Gryffindor") {
        houseArray = gryffindorPrefects;
    } else if (foundStudent.house === "Ravenclaw") {
        houseArray = ravenclawPrefects;
    } else if (foundStudent.house === "Slytherin") {
        houseArray = slytherinPrefects;
    }
    checkPrefects()

    function checkPrefects() {
        if (houseArray.length < 2 && !prefect.isPrefect) {
            console.log("hired Prefect")
            houseArray.push(prefect);
            document.querySelector("#prefectButton").textContent = "Fire Prefect";
            prefect.isPrefect = "Prefect"
            document.querySelector("#prefectPoint").textContent = "Is a Prefect";
        } else if (prefect.isPrefect){
            houseArray = houseArray.filter(data => data.studentId - 1 !== studentNumber);
            prefect.isPrefect = "";
            document.querySelector("#prefectButton").textContent = "Hire Prefect";
            document.querySelector("#prefectPoint").textContent = "Not a Prefect";
            if (prefect.house === "Hufflepuff") {
                hufflepuffPrefects = houseArray;
            } else if (foundStudent.house === "Gryffindor") {
                gryffindorPrefects  = houseArray;
            } else if (foundStudent.house === "Ravenclaw") {
                ravenclawPrefects  = houseArray;
            } else if (foundStudent.house === "Slytherin") {
                slytherinPrefects  = houseArray;
            }
        } else {
            prefectPopUp();
        };
    }

}



//todo configure pop ups

function prefectPopUp() {
    window.alert("NOOO")
}

//display pop up


//hack the system / hackTheSystem