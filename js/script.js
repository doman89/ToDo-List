class Task {
    constructor(textContent, endTime = 0) {
        let _liElement = null; //new
        let _textContent = textContent;
        let _endTime = endTime;
        let _isDone = false;
        let _index = null;
        let _date = endTime;
        this.getTime = () => _date;
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
        const span = document.createElement('span');
        span.textContent = `${this.getTime()? this.showDeadline() : '' }`;
        li.appendChild(span);
        li.innerHTML += ` ${this.getTextContent()} `;
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
        this.updateDeadline();
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
        this.updateDeadline();
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
    showDeadline() {
        if (!this.getTime())
            return '';
        const currentDate = new Date();
        const tempDate = new Date(`${currentDate.getFullYear()}, ${currentDate.getMonth() + 1}, ${currentDate.getDate()}, `);
        if (tempDate.getTime() < this.getTime()) {
            let deadline = this.getTime() - tempDate.getTime();
            deadline /= 86400000;
            if (deadline >= 1)
                return `End of deadline in ${Math.floor(deadline)} days! `;
            else if (deadline)
                return 'End of deadline is today! ';
        } else {
            return 'Deadline is end!';
        }

    }
    updateDeadline() {
        const li = this.getLiElement();
        const span = li.querySelector('span');
        console.log(span.textContent);
        span.textContent = this.showDeadline();
        return this.setLiElement(li);
    }
}

const form = document.querySelector('section form');
const inputSearch = document.querySelector('.search');
const ulTaskList = document.querySelector('section .lists .todo ul');
const ulCompletedList = document.querySelector('section .lists .done ul');
const input = document.querySelector('section input');
const numberOfToDo = document.querySelector('.todoTasksNumber');
const numberOfDone = document.querySelector('.doneTasksNumber');
const inputDate = document.getElementById('inputDate');
const inputCheckbox = document.getElementById('dateCheckbox');

const dateNowUserComputer = new Date();

const todoTasks = [];

const addTask = () => {
    event.preventDefault();
    const newItem = input.value.trim();
    let taskDate = new Date(null);
    if (!newItem)
        return;
    if (inputCheckbox.checked) {
        activityCalendar();
        inputCheckbox.checked = false;
        taskDate = new Date(inputDate.valueAsNumber);
    }
    const task = new Task(newItem, taskDate);
    task.createListElement(removeTask);
    todoTasks.push(task);
    updateTaskList();
    if (inputCheckbox.checked) {
        activityCalendar();
        inputCheckbox.checked = false;
    }
    inputDate.value = '';
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

const updateCompletedList = (inputClean = true) => {
    ulCompletedList.textContent = null;
    numberOfDone.textContent = todoTasks.filter((task, index) => {
        if (task.getStatus()) {
            task.setDataset(index);
            ulCompletedList.appendChild(task.getLiElement());
            return true;
        }
    }).length;
    if (inputClean)
        inputSearch.value = null;
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
    const index = e.target.parentNode.dataset.index;
    todoTasks[index].toCompleted(restoreTask, deleteTask);
    updateCompletedList();
    updateTaskList();
};



const filterTasks = (e, node = false) => {
    let tempTodoList = null;
    if (!node)
        tempTodoList = todoTasks.filter(task => task.hasText(e.target.value));
    else
        tempTodoList = todoTasks.filter(task => task.hasText(e.value));
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

const filterTasks2 = e => {
    const tempTodoList = todoTasks.filter(task => task.hasText(e.value));
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

const activityCalendar = () => {
    inputDate.classList.toggle('active')
}

inputCheckbox.addEventListener('click', activityCalendar);
form.addEventListener('submit', addTask);
inputSearch.addEventListener('input', filterTasks);

const run = () => {
    todoTasks.forEach(task => task.updateDeadline());
    updateCompletedList(false);
    updateTaskList();
    filterTasks(inputSearch, true);
}

let timer = setInterval(run, 30000);