console.clear();

class Task {
  constructor(desc, fin = false) {
    this.desc = desc;
    this.fin = fin;
    this.id = Math.random()
      .toString(36)
      .substr(2, 16);
  }
  toggleFin() {
    this.fin = !this.fin;
  }
}

const createTodoEle = obj => {
  const todo = document.createElement('label');
  const att = document.createAttribute('key');
  att.value = obj.id;
  todo.classList.add('todo');
  todo.setAttributeNode(att);
  todo.innerHTML = `
      <input class="todo__state" type="checkbox" action="check-box" ${
        obj.fin ? 'checked' : ''
      }/>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 200 25"
        class="todo__icon"
      >
        <use xlink:href="#todo__line" class="todo__line"></use>
        <use xlink:href="#todo__box" class="todo__box"></use>
        <use xlink:href="#todo__check" class="todo__check"></use>
        <use xlink:href="#todo__circle" class="todo__circle"></use>
        <use xlink:href="#close__circle" class="close__circle"></use>
      </svg>
      <div class="todo__text">${obj.desc}</div>
      <button class="todo__close" action="delete-todo">x
      </button>
  `;
  return todo;
};
const appendEleToTodoListEle = domEle => {
  let todoList = document.getElementById('todo-list');
  todoList.appendChild(domEle);
};
const dataIntoTodoList = tasks => {
  tasks.forEach(task => {
    appendEleToTodoListEle(createTodoEle(task));
  });
};
const updateLocalStorage = obj => {
  localStorage.setItem(appName, JSON.stringify(obj));
};
const setCloseBtnStatus = (htmlAry, status) => {
  for (let i = 0; i < htmlAry.length; i++) {
    htmlAry[i].disabled = status;
  }
};
const updateBadgeText = num => {
  if (chrome.browserAction) {
    chrome.browserAction.setBadgeText({ text: num });
  }
};
const onClickFunction = event => {
  const { target } = event;
  const btnDisable = target.disabled ? true : false;
  const btnAction = target.attributes.action
    ? target.attributes.action.value
    : null;
  const todoId = target.parentElement.attributes.key
    ? target.parentElement.attributes.key.value
    : null;
  // if (btnAction === 'add-to-do') {
  //   addToDo();
  // }
  if (btnAction === 'delete-todo' && btnDisable === false) {
    // add class for animation
    // when animation finished, remove ele node
    setCloseBtnStatus(btnToClose, true);
    target.parentElement.classList.add('hide');
    setTimeout(function() {
      // edit data,
      // update data to localstorage
      // remove clicked todo ele
      store.daily = store.daily.filter(todo => todo.id != todoId);
      store.unfinishedTasks--;
      updateBadgeText(store.unfinishedTasks);
      target.parentElement.remove();
      setCloseBtnStatus(btnToClose, false);
      updateLocalStorage(store);
    }, 550);
  }
  if (btnAction === 'check-box') {
    // clicked anywhere other than the delete btn
    // update localstorage
    store.daily.forEach(todo => {
      if (todo.id === todoId) {
        todo.fin = !todo.fin;
        store.unfinishedTasks--;
        updateBadgeText(store.unfinishedTasks);
        updateLocalStorage(store);
      }
    });
  }
};
const onFormSubmit = event => {
  event.preventDefault();
  let inputVal = event.target.elements['form-input'].value;
  formInput.value = '';
  // create new task with form-input
  // add task to data
  // update localstorage with data
  // add task to dom ele, todo list
  const newTask = new Task(inputVal);
  const storeCopy = { ...store };
  storeCopy.daily.push(newTask);
  store.unfinishedTasks++;
  updateBadgeText(store.unfinishedTasks);
  updateLocalStorage(storeCopy);
  appendEleToTodoListEle(createTodoEle(new Task(inputVal)));
};

// DOM elements && constants
const appName = 'daily-goals';
const btnToClose = document.getElementsByClassName('todo__close');
const todoList = document.getElementById('todo-list');
const todos = document.getElementsByClassName('todo');
let store = localStorage.getItem(appName)
  ? JSON.parse(localStorage.getItem(appName))
  : null;
const inputFormSubmit = document.querySelector('.input-form');
const formInput = document.querySelector('.input-form input');

// data is stored in local storage
if (store) {
  // when there are stored data
  const currentDate = new Date();
  const storeDate = new Date(store.date);
  if (storeDate.getDate() != currentDate.getDate()) {
    // new day! set all goal to false
    for (let task of store.daily) {
      task.fin = false;
    }
    store.date = currentDate;
    updateLocalStorage(store);
  }
  let aryNotFin = store.daily.filter(task => {
    task.fin === false;
  });
  store.unfinishedTasks = aryNotFin.length;
  updateBadgeText(store.unfinishedTasks);
  // inset data to UI
  dataIntoTodoList(store.daily);
} else {
  // no stored data; test
  let data = {
    daily: [
      new Task('Example task', true),
      new Task('do stuff'),
      new Task('do stuff'),
    ],
    date: new Date(),
    unfinishedTasks: 0,
  };
  let aryNotFin = data.daily.filter(task => {
    task.fin === false;
  });
  data.unfinishedTasks = numUnfinTask = aryNotFin.length;
  updateBadgeText(data.unfinishedTasks);
  dataIntoTodoList(store.daily);
}

// event listeners
todoList.addEventListener('click', onClickFunction);
inputFormSubmit.addEventListener('submit', onFormSubmit);
