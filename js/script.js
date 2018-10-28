const form = document.querySelector('section form');
const ulTaskList = document.querySelector('section .lists .todo ul');
const ulCompletedList = document.querySelector('section .lists .done ul');
const input = document.querySelector('section input');
const numberOfToDo = document.querySelector('section .lists .todo h2 span');
const numberOfDone = document.querySelector('section .lists .done h2 span');

const todoList = [];
const doneList = [];

const deleteTask = e => {
    const index = e.target.parentNode.dataset.index;
    doneList.splice(index, 1);
    ulCompletedList.textContent = null;
    updateCompletedList();
}

const updateTaskList = () => {
    ulTaskList.textContent = null;
    todoList.forEach((task, index) => {
        task.dataset.index = index;
        ulTaskList.appendChild(task);
    })
    numberOfToDo.textContent = todoList.length;
}

const updateCompletedList = () => {
    ulCompletedList.textContent = null;
    doneList.forEach((task, index) => {
        task.dataset.index = index;
        ulCompletedList.appendChild(task);
    })
    numberOfDone.textContent = doneList.length;
    input.value = null;
}

const recoveryTask = e => {
    const index = e.target.parentNode.dataset.index;
    const button = doneList[index].querySelector('button');
    button.textContent = 'Remove';
    button.removeEventListener('click', recoveryTask);
    button.addEventListener('click', removeTask);
    const deleteButton = doneList[index].querySelector('button:nth-last-child(1)');
    deleteButton.remove();
    todoList.push(...doneList.splice(index, 1));
    updateCompletedList();
    updateTaskList();
}

const removeTask = e => {
    const index = e.target.parentNode.dataset.index; //get index of element
    todoList[index].innerHTML += ' '; // add space between old button and new to create
    todoList[index].appendChild(document.createElement('button')); //create new button
    const button = todoList[index].querySelector('button'); //way to first button
    button.textContent = 'Restore';
    button.addEventListener('click', recoveryTask);
    const deleteButton = todoList[index].querySelector('button:nth-last-child(1)'); //way to new button
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', deleteTask);
    doneList.push(...todoList.splice(index, 1)); //transfer task to completed 
    updateCompletedList();
    updateTaskList();
};

const addTask = () => {
    event.preventDefault();
    const newTask = input.value.trim();
    if (!newTask)
        return;
    const tempTask = document.createElement('li');
    tempTask.className = 'task';
    tempTask.textContent = newTask;
    tempTask.innerHTML += ' <button>Remove</button>';
    todoList.push(tempTask);
    tempTask.querySelector('button').addEventListener('click', removeTask);
    updateTaskList();
    input.value = '';
};

const filterTasks = e => {
    const tempTodoList = todoList.filter(task => task.textContent.toLowerCase().includes(e.target.value.toLowerCase()));
    const tempDoneList = doneList.filter(task => task.textContent.toLowerCase().includes(e.target.value.toLowerCase()));
    ulCompletedList.textContent = ulTaskList.textContent = null;
    tempTodoList.forEach(li => ulTaskList.appendChild(li));
    tempDoneList.forEach(li => ulCompletedList.appendChild(li));
    numberOfToDo.textContent = tempTodoList.length;
    numberOfDone.textContent = tempDoneList.length;
}

form.addEventListener('submit', addTask);
input.addEventListener('input', filterTasks);