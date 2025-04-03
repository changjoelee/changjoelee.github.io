// numerical variables 0-9
let a = 10;
let b = 20;
let c = 30;
console.log(c);

// +addition -substraction *multiplication / division

// string variable - text enclosed in '', "", or `` (backtick)
let myName = "joe lee";
console.log("hi,", myName); // 또는: console.log(`hi, ${myName}`);
let myCity = "melbourne";
let msg = "<h1> I live in ${myName} h1";

// boolean variable - true or false
let isItSunday = false;
let isItOART1031 = true;

// object variable - a structured data format
const myStudentRecord = {
  name: "joe",
  id: 1234,
  homeTown: "Melbourne",
  isLocal: false,
};
// arrays array start at 0
//let student0 = "camele";
//let student1 = "joe";
//let student2 = "lee";
//let student3 = "chang";
let students = ["camele", "joe", "lee", "chang", "David"];
console.log(students);
console.log(students[2]);
//if conditions
let grade = 70;

if (grade < 70) {
  console.log("you failed");
} else {
  console.log("you passed!!");
}
for (let i = 0; i < students.length; i++) {
  console.log("Hello", students[i]);
}
for (let step = 0; step < 10; step++) {
  console.log("taking step No:");
}
