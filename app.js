//CRUD operation with API example

// access to the btn modal and form
const modal =document.getElementById("studentModal");
const form =document.getElementById("student-form");
// we need this variable when we use api
const url ="https://cwbarry.pythonanywhere.com/student/";
let students;
const operation ={   // for modal we need add without id , the object operation will be used in  add btn and update btn
    type : "Add",
    id: null
}
//Display the student all the list than we make crud operation
function displayStudents(data){

    // in ul shoud be apear all the student,so we access the container
    const studentContainer = document.getElementById("student-container");

    // each student inside a li html logic
    const html = data.map((student)=>`
    <li
              data-id="${student.id}"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              ${student.number} ${student.first_name} ${student.last_name}
              <div class="btn-group" role="group">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#studentModal"
                  type="button"
                  class="btn btn-warning"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </li>
    
    `)
    //to render this in browser 
    studentContainer.innerHTML =html.join();
}
//Fetch the student from the Api and use the displaystudents function,when we somthing with Api we use async function 
async function getData (){
    //   (await)wait for this function when it finish go to the next function
    const response = await axios.get(url);
    students= response.data;
    displayStudents(students);
}

//to see the data in the browser we have to call the function getData,when website started we fetch the data automaticlly and display it 
window.addEventListener("DOMContentLoaded",()=>{
    getData();
})

//Modal form submit
form.addEventListener("submit",(event)=>{
    event.preventDefault();  //to prevent the refretioning the page and keep the data to make somthing with it
    //collecte the information from form inputs
    const first_name = document.getElementById("first-name").value;
    const last_name = document.getElementById("last-name").value;
    const number = document.getElementById("number").value;
    const path = document.getElementById("path").value;
   /*  console.log(first_name,last_name, number ,path); */

    if( operation.type==="Add"){
        addStudent(first_name,last_name,number,path);// we shoud call this function here ,when we click sumbit or add btn we add to the database and see that in our page
    }else{
        updateStudent(operation.id,first_name,last_name,number,path); // we need id ,we get that from click on update btn , from addevent on student-container
        //reset the operation logic after updating the student
        operation.type= "Add";
        operation.id=null;
    }
    
    //close the window after the btn clicked ,after submit ,add or update the window shoud be closed
    //reach the modal 
    const modalBs =bootstrap.Modal.getInstance("#studentModal");
    //hide the model after submit
    modalBs.hide();
})


//crud operation 
//Add a student ,  we need to send info to the database 
 async function addStudent(first_name,last_name,number,path){
   const response = await axios({
    method:"post",
    url:url,
    data:{first_name,last_name,number,path}   
})
   getData();   // after adding the data will be getting and apear in the screen
 }

 //update a student ,we need id also
 async function updateStudent(id,first_name,last_name,number,path){
    const response= await axios({
        method:"put",
        url: url + id + "/",
        data:{first_name,last_name,number,path} 
    })
      getData();
 }

 //Delete a student   , we delet 
 async function deleteStudent(id){
    const response =await axios({
        method: "delete",
        url: url + id +"/"
    })
    getData();
 }

//here capturing effect : add event to the parent wich has 2 btn ,for delete and update 
// we cannot use the variable (studentContainer)becuse it is inside the function, we can just deklare a global variable for that
document.getElementById("student-container").addEventListener("click",(event)=>{

    if(event.target.classList.contains("btn-danger")||event.target.classList.contains    ("bi-trash")){
     // when click the delete btn or the trash icon 
        const id =event.target.closest("li").dataset.id; //we get the id  student
        deleteStudent(id); // than we call the func to delete the student
    }
  
    //Edit button handling
    //when the update btn is clicked we will pass the data into form and set the form into edit mode( the data go to the form edit)
    if(event.target.classList.contains("btn-warning")||event.target.classList.contains("bi bi-pencil")){
        const id =event.target.closest("li").dataset.id;//we get the id student ,here retern id as string 
        //set the form to update mode
        operation.id=id;
        operation.type="Update"
        //we shoud have the student information to make update on it
        //find the student by id ,get singel student which match with id ,get the student info from database
        // +id :to convert the id string to number , because id in Api is number
        const student =students.find((student)=> student.id === +id )
        // filled form with the  student information we update this values to new values,we see the old value and can update it 
         document.getElementById("first-name").value= student.first_name;
         document.getElementById("last-name").value= student.last_name;
         document.getElementById("number").value=student.number;
         document.getElementById("path").value=student.path;
    }
    })

//modal changeing from add and update
//bootstrap modal handling in dom,shown.bs.modal is bootstrap event which trigging when the modal is opend
modal.addEventListener("shown.bs.modal",()=>{
      form.querySelector("button").textContent=operation.type; // to change the text inside the btn to (update) or Add , 
      document.getElementById("studentModalLabel").textContent=`${operation.type} a student `;
      //we change the title (add / update) a student  

})


//if we click on update a student then operation.type will be update in add btn also ,so we need to fix it 
//so we access the add btn ,if add btn is clicked it will be reset everything in form and set operation.
document.getElementById("add-student-btn").addEventListener("click",(event)=>{
           operation.type="Add";
           operation.id=null;
           form.reset()
})