class Task {
    constructor(textContent, endTime = 0) {
        let _liElement = null; //new
        let _textContent = textContent;
        let _endTime = endTime;
        let _isDone = false;
        let _index = null;
        this.getLiElement = () => _liElement; //new
        this.setLiElement = li => _liElement = li;
        this.getTextContent = () => _textContent;
        this.getEndTime = () => _endTime;
        this.getStatus = () => _isDone;
        this.changeStatus = () => _isDone = !_isDone;
        this.getIndex = () => _index;
        this.setIndex = index => _index = index;
    }
    createListElement(removeCallbackFn) {
        const li = document.createElement('li');
        li.className = 'task';
        li.textContent = `${this.getTextContent()} `;
        const button = document.createElement('button');
        button.textContent = 'Remove';
        li.appendChild(button);
        li.querySelector('button').addEventListener('click', removeCallbackFn);
        li.dataset.index = null;
        return this.setLiElement(li);
    }
    setDataset(index) {
        const li = this.getLiElement();
        li.dataset.index = this.setIndex(index);
        return this.setLiElement(li);
    }
    toCompleted(restoreCallbackFn, deleteCallbackFn) {
        const li = this.getLiElement();
        li.innerHTML += ' ';
        li.appendChild(document.createElement('button'));
        let button = li.querySelector('button');
        button.textContent = 'Restore';
        button.addEventListener('click', restoreCallbackFn);
        button = li.querySelector('button:nth-last-child(1)');
        button.textContent = 'Delete';
        button.addEventListener('click', deleteCallbackFn);
        this.changeStatus();
        return this.setLiElement(li);
    }
    toTodo(removeCallbackFn, restoreCallbackFn) {
        const li = this.getLiElement();
        let button = li.querySelector('button');
        button.textContent = 'Remove';
        button.removeEventListener('click', restoreCallbackFn);
        button.addEventListener('click', removeCallbackFn);
        button = li.querySelector('button:nth-last-child(1)');
        button.remove();
        this.changeStatus();
        return this.setLiElement(li);
    }
    hasText(text) {
        return this.getTextContent().toLowerCase().includes(text.toLowerCase());
    }
}

const form = document.querySelector('section form');
const ulTaskList = document.querySelector('section .lists .todo ul');
const ulCompletedList = document.querySelector('section .lists .done ul');
const input = document.querySelector('section input');
const numberOfToDo = document.querySelector('section .lists .todo h2 span');
const numberOfDone = document.querySelector('section .lists .done h2 span');

const todoTasks = [];

const addTask = () => {
    event.preventDefault();
    const newItem = input.value.trim();
    if (!newItem)
        return;
    const task = new Task(newItem);
    task.createListElement(removeTask);
    todoTasks.push(task);
    updateTaskList();
    input.value = '';
};

const updateTaskList = () => {
    ulTaskList.textContent = null;
    numberOfToDo.textContent = todoTasks.filter((task, index) => {
        if (!task.getStatus()) {
            task.setDataset(index);
            ulTaskList.appendChild(task.getLiElement());
            return true;
        }
    }).length;
}

const updateCompletedList = () => {
    ulCompletedList.textContent = null;
    numberOfDone.textContent = todoTasks.filter((task, index) => {
        if (task.getStatus()) {
            task.setDataset(index);
            ulCompletedList.appendChild(task.getLiElement());
            return true;
        }
    }).length;
    input.value = null;
}

const deleteTask = e => {
    const index = e.target.parentNode.dataset.index;
    todoTasks.splice(index, 1);
    ulCompletedList.textContent = null;
    updateCompletedList();
}

const restoreTask = e => {
    const index = e.target.parentNode.dataset.index;
    todoTasks[index].toTodo(removeTask, restoreTask);
    updateCompletedList();
    updateTaskList();
}

const removeTask = e => {
    const index = e.target.parentNode.dataset.index; //get index of element
    todoTasks[index].toCompleted(restoreTask, deleteTask);
    updateCompletedList();
    updateTaskList();
};



const filterTasks = e => {
    const tempTodoList = todoTasks.filter(task => task.hasText(e.target.value));
    let taskNumberToDo = 0;
    let taskNumberCompleted = 0;
    ulCompletedList.textContent = ulTaskList.textContent = null;
    tempTodoList.forEach(task => {
        if (task.getStatus()) {
            ulCompletedList.appendChild(task.getLiElement());
            taskNumberCompleted++;
        } else {
            ulTaskList.appendChild(task.getLiElement());
            taskNumberToDo++;
        }

    })
    numberOfToDo.textContent = taskNumberToDo;
    numberOfDone.textContent = taskNumberCompleted;
}

form.addEventListener('submit', addTask);
input.addEventListener('input', filterTasks);