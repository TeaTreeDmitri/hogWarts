"use strict"

//global variables
let studentNames;
let firstName;
let middleName;
let lastName;
let imageTag1;
let imageTag2;


//global objects
let allStudents = [];

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
    }



document.addEventListener("DOMContentLoaded", event => {
    console.log("DOMContentLoaded")
    initialise();

})


//fetch the data 

async function initialise() {
    console.log("initialise()")
    await loadNames();
    // await loadBlood();
    prepareObjects();
    console.log(allStudents);
}

//fetch names 
async function loadNames(){
    const nameData = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentNames = await nameData.json();
    console.log(studentNames)
    prepareObjects(studentNames);
}

//fetch images


//fetch blood status
// async function loadBlood() {
//     const bloodData = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
//     const studentBlood = await bloodData.json();
// }

function prepareObjects(names) {
    allStudents = names.map(prepareData);
    displayList(allStudents);
}

//clean up the name data 
function prepareData(el) {
    console.log("prepareData()");
        
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
        // console.log("Fullname: ", el.fullname);
        // console.log("First Name: ", firstName);
        // console.log("Middle Name: ", middleName);
        // console.log("Last Name: ", lastName);
        // console.log("Nickname: ", nickName);
        // console.log("House: ", houseName);
        // console.log("Gender: ", studentGender);
        // console.log(" ");

        //put variables into newobjects
        const student = Object.create(Student);
        student.firstName = firstName;
        student.lastName = lastName;
        student.middleName = middleName;
        student.nickName = nickName;
        student.house = houseName;
        student.gender = studentGender;
        // console.table(student);

        

        return student;
}



//display the data 

function displayList() {
    console.log("displayList()")
    console.log(allStudents);
}

//filter the data 

//filter by attending/expelled

//filter by house

//filter by prefects

//filter by inquisitors


//sort the data

//sort by first name

//sort by last name

//sort by house


//open student page 


//display student information


//expel function

//configure pop up

//display pop up


//prefect function

//configure pop up

//display pop up


//hack the system / hackTheSystem()