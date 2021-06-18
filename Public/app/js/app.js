const todoContainer = document.querySelector('.todo-items')

//Setting Default value of Date to current Date
let date = new Date();
document.getElementById('date').defaultValue =
    date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + date.getDate().toString().padStart(2, 0);

// funtion to post a new task to database
async function sendData(e) {
    const form = e.target;
    //using Browsers's fetch API to POST data asynchronouslys
    let response = await fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            desc: form.children[1].value,
            date: form.children[2].value,
            category: form.children[3].value
        })
    })
    random = form.children[2].value
    console.log(form.children[2].value)
    response = await response.json()

    if (response.error) {
        console.log('Validation failed', response.error)
        alert('Data Validation Failed')
    }
    //appending New Data to List
    else {
        let date = response.date
        date = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(0, 4)}`
        let newTodo = document.createElement('div')
        newTodo.classList.add('todo-task', "flex", "flex-fdc", "flex-jcsb")
        let html = `<div class="todo-task-desc">${response.desc}</div>
        <div class="flex flex-jcsb">
        <div class="todo-task-date flex flex-aic">
        <img src="/Public/images/calender.svg" alt="calender">
        <p style="margin-left:0.5rem; padding-bottom:2px;">${date}</p>
        </div>
        <div class="todo-task-category" style="background-color:${decideColor(response.category)}">${response.category}</div>
        </div>
        <div class="flex todo-task-buttons-cont">
        <button class="todo-task-buttons flex flex-aic flex-jcc" onclick="markComplete(this)" class="markCompleteButton" data-id="${response._id}">Mark Completed</button>
        <button class="todo-task-buttons flex flex-aic flex-jcc" onclick="delTodo(this)" class="deleteButton" data-id="${response._id}">Delete</button>
        </div>`
        newTodo.innerHTML = html
        //inserting new task on the page
        todoContainer.insertBefore(newTodo, todoContainer.firstChild)
        newTodo.scrollIntoView()
    }
    form.reset()
}

//event listener on submit form
document.addEventListener("submit", (e) => {
    e.preventDefault();
    sendData(e)
})

//function to retrieve all tasks from the database
async function getToDo() {
    let response = await fetch('/getToDos')
    response = await response.json()
    //instead of logging in console I have to display on the page in good way
    console.log(response)
    response.forEach(element => {
        let date = element.date
        date = `${date.slice(8, 10)}-${date.slice(5, 7)}-${date.slice(0, 4)}`
        let newTodo = document.createElement('div')
        newTodo.classList.add('todo-task', "flex", "flex-fdc", "flex-jcsb")
        let html = `<div class="todo-task-desc">${element.desc}</div>
        <div class="flex flex-jcsb">
        <div class="todo-task-date flex flex-aic">
        <img src="/Public/images/calender.svg" alt="calender">
        <p style="margin-left:0.5rem; padding-bottom:2px;">${date}</p>
        </div>
        <div class="todo-task-category" style="background-color:${decideColor(element.category)}">${element.category}</div>
        </div>
        <div class="flex todo-task-buttons-cont">`
        if (element.done == true) {
            html += `<button class="todo-task-buttons flex flex-aic flex-jcc" style="background-color: grey; color: black; border: none; opacity: 0.7;" onclick="markComplete(this)" data-id="${element._id}"><img
            src="/Public/images/check.svg" alt="tick">Completed</button>
            <button class="todo-task-buttons flex flex-aic flex-jcc" onclick="delTodo(this)" data-id="${element._id}">Delete</button>
            </div>`
        }
        else {
            html += `<button class="todo-task-buttons flex flex-aic flex-jcc" onclick="markComplete(this)" data-id="${element._id}">Mark Completed</button>
            <button class="todo-task-buttons flex flex-aic flex-jcc" onclick="delTodo(this)" data-id="${element._id}">Delete</button>
            </div>`
        }

        newTodo.innerHTML = html
        todoContainer.appendChild(newTodo)
    });
}
getToDo()

//function to delete a task
async function delTodo(e) {
    e.parentElement.parentElement.remove()
    let response = await fetch(`/delete/${e.dataset.id}`, {
        method: 'DELETE'
    })
    response = await response.json()
    console.log(response)
}

//function to mark a task as complete
async function markComplete(e) {
    e.setAttribute('style', 'background-color: grey; color: black; border: none; opacity: 0.7;')
    e.setAttribute('disabled', 'true')
    e.innerHTML = `<img
    src="/Public/images/check.svg" alt="tick">Completed`
    let response = await fetch(`/done/${e.dataset.id}`, {
        method: 'PUT'
    })
    response = await response.json()
    console.log(response)
}

//function to decide the background color to category div
function decideColor(category) {
    switch (category) {
        case 'Personal':
            return '#3772FF';
        case 'Home':
            return '#F4B942';
        case 'College':
            return '#B14AED';
        case 'Other':
            return '#009fb7'
        default:
            return 'Black';
    }
}