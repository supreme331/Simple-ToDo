const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)

tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask(event) {

    event.preventDefault()
    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    tasks.push(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
}

function deleteTask(event) {

    if (event.target.dataset.action !== 'delete') return

    const parentNode = event.target.closest('.list-group-item')

    tasks = tasks.filter(task => task.id !== +parentNode.id)

    saveToLocalStorage()

    parentNode.remove()

    checkEmptyList()
}

function doneTask(event) {

    if (event.target.dataset.action !== 'done') return

    const parentNode = event.target.closest('.list-group-item')

    const task = tasks.find((task) => task.id === +parentNode.id)

    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {

    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/empty.png" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`

        tasksList.insertAdjacentHTML('beforebegin', emptyListHTML)
    }

    if (tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList')

        emptyListElement ? emptyListElement.remove() : null
    }
}

function saveToLocalStorage() {

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {

    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    const taskHTML = `
    <li id="${task.id}" class="list-group-item task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/done.png" alt="Done" width="16" height="16">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/delete.png" alt="Done" width="16" height="16">
            </button>
        </div>
    </li>`

    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}