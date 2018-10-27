const form = document.querySelector('section form');
const ulTaskList = document.querySelector('section .lists .todo ul');
const ulCompletedList = document.querySelector('section .lists .done ul');
const input = document.querySelector('section input');
const numberOfToDo = document.querySelector('section .lists .todo h2 span');
const numberOfDone = document.querySelector('section .lists .done h2 span');

const todoList = [];
const doneList = [];

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
}

const recoveryTask = e => {
    const index = e.target.parentNode.dataset.index;
    const button = doneList[index].querySelector('button');
    button.textContent = 'Remove';
    button.removeEventListener('click', recoveryTask);
    button.addEventListener('click', removeTask);
    todoList.push(doneList[index]);
    doneList.splice(index, 1);
    updateCompletedList();
    updateTaskList();
}

const removeTask = e => {
    const index = e.target.parentNode.dataset.index;
    const button = todoList[index].querySelector('button');
    button.textContent = 'Restore';
    button.removeEventListener('click', removeTask);
    button.addEventListener('click', recoveryTask);
    doneList.push(todoList[index]);
    todoList.splice(index, 1);
    updateCompletedList();
    updateTaskList();
};

const addTask = () => {
    event.preventDefault();
    const newTask = input.value;
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

form.addEventListener('submit', addTask);