const form = document.querySelector('.form')
const input = document.querySelector('.input__task')
const btAddTask = document.querySelector('.add__task')
const ul = document.querySelector('.tasks__list')
const deleteMsg = document.querySelector('.confirm__delete-msg')
const confirmBt = document.querySelector('.confirm')
const cancelBt = document.querySelector('.cancel')
const completedList = document.querySelector('.completed__list')
const countPending = document.querySelector('.pending__info')
const countCompleted = document.querySelector('.completed__info')


let saveTasks = JSON.parse(localStorage.getItem('Task')) || []
let counters = JSON.parse(localStorage.getItem('counter')) || [{completeds: 0, pendings: 0}]

function attLocalStorage(){
    localStorage.setItem('Task', JSON.stringify(saveTasks))
    localStorage.setItem('counter', JSON.stringify(counters))
}



form.addEventListener('submit', (e) => {
    e.preventDefault()

    const newTask = {
        name: input.value,
        completed: false,
        delete: false
    }
    
    if(input.value){
        const li = createTask(newTask)
        ul.appendChild(li)
        countPending.textContent = ++counters[0].pendings
        saveTasks.push(newTask)
        attLocalStorage()
    } else {
        alert('Adicione um nome para a tarefa')
    }

    
})

function createTask(newTask){
    const li = document.createElement('li')
    const p = document.createElement('p')
    const check = document.createElement('input')
    const divText = document.createElement('div')
    const divBtns = document.createElement('div')
    const editBt = document.createElement('button')
    const deleteBt = document.createElement('button')
    const editIcon = document.createElement('i')
    const deleteIcon = document.createElement('i')


    li.classList.add('task__item')
    p.classList.add('task__text')
    check.setAttribute('type', 'checkbox')
    divText.classList.add('div__text')
    divBtns.classList.add('container__btns')
    editBt.classList.add('task__btns')
    deleteBt.classList.add('task__btns')
    editIcon.classList.add('fa-solid', 'fa-pen-to-square')
    deleteIcon.classList.add('fa-solid', 'fa-trash')

    p.textContent = newTask.name
    divText.append(check)
    divText.append(p)
    editBt.append(editIcon)
    deleteBt.append(deleteIcon)
    divBtns.append(editBt)
    divBtns.append(deleteBt)
    li.append(divText)
    li.append(divBtns)

    check.addEventListener('click', () => completeTask(newTask, li, p, check, editBt))

    editBt.addEventListener('click', () => editTask(newTask, p))

    deleteBt.addEventListener('click', () => deleteTask(li ,newTask))

    input.value = ''
    input.focus()

    return li

}

saveTasks.forEach(task => {
    if(task.completed !== 'true') {
        const renderUl = createTask(task)
         ul.appendChild(renderUl)
    } else {
        const renderUl = createTask(task)
        const checkInput = renderUl.querySelector('input')
        const editBt = renderUl.querySelector('.task__btns')
        const p = renderUl.querySelector('p')
        p.style.textDecoration = 'line-through'
        renderUl.style.backgroundColor = 'yellowgreen'
        checkInput.remove()
        editBt.remove()
        completedList.appendChild(renderUl)
    }
})

counters.forEach(taskInfo => {
    countCompleted.textContent = taskInfo.completeds 
    countPending.textContent = taskInfo.pendings
})

function editTask(task, p){
    const newNameTask = prompt('Digite um novo nome para a tarefa')
    if(newNameTask){
        p.textContent = newNameTask
        task.name = newNameTask
        attLocalStorage()
    } else {
        p.textContent = p.textContent
    }

}

function deleteTask(li, task){
    task.delete = 'true'
    task.completed ?  --counters[0].completeds : --counters[0].pendings
    deleteMsg.style.display = "initial"
    confirmBt.addEventListener('click', () => confirmDelete(li))
    attLocalStorage()
}


function confirmDelete(li){
    li.remove()
    saveTasks = saveTasks.filter(task => task.delete !== "true" )
    countCompleted.textContent = counters[0].completeds
    countPending.textContent = counters[0].pendings
    deleteMsg.style.display = "none"
    attLocalStorage()
}

function completeTask(task, li, p, input, editBt){
    p.style.textDecoration = "line-through"
    task.completed = "true"
    input.remove()
    editBt.remove() 
    li.style.backgroundColor = "yellowgreen"  
    completedList.appendChild(li)
    countCompleted.textContent = ++counters[0].completeds
    countPending.textContent = --counters[0].pendings
    attLocalStorage()
}


cancelBt.addEventListener('click', () => {
    deleteMsg.style.display = "none"
    saveTasks.forEach(task => task.delete = "false")
    counters[0].completeds = countCompleted.textContent
    counters[0].pendings = countPending.textContent

    attLocalStorage()
})

