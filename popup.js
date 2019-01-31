console.clear();
const appName = 'daily-goal';
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
      <input class="todo__state" type="checkbox" ${obj.fin ? 'checked' : ''}/>
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
      </svg>
      <div class="todo__text">${obj.desc}</div>
      <span class="todo__close" action="delete-todo">x</span>
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
const onClickFunction = event => {
  const { target } = event;
  const btnAction = target.attributes.action
    ? target.attributes.action.value
    : null;
  const todoId = target.parentElement.attributes.key.value;
  // if (btnAction === 'add-to-do') {
  //   addToDo();
  // }

  if (btnAction === 'delete-todo') {
    // add class for animation
    // when animation finished, remove ele node
    target.parentElement.classList.add('hide');
    setTimeout(function() {
      // edit data,
      // update data to localstorage
      // remove clicked todo ele
      let storeCopy = { ...store };
      storeCopy.daily = storeCopy.daily.filter(todo => todo.id != todoId);
      updateLocalStorage(storeCopy);
      target.parentElement.remove();
    }, 500);
  } else {
    // clicked anywhere other than the delete btn
    // update localstorage
    let storeCopy = { ...store };
    storeCopy.daily.forEach(todo => {
      if (todo.id === todoId) {
        todo.fin = !todo.fin;
      }
    });
    updateLocalStorage(storeCopy);
  }
};

// DOM elements
const todoList = document.getElementById('todo-list');
const todos = document.getElementsByClassName('todo');
const store = localStorage.getItem(appName)
  ? JSON.parse(localStorage.getItem(appName))
  : null;

// data is stored in local storage
if (store) {
  // when there are stored data
  dataIntoTodoList(store.daily);
} else {
  // no stored data; test
  let data = {
    daily: [
      new Task('Test task', true),
      new Task('do stuff'),
      new Task('do stuff'),
    ],
  };
  localStorage.setItem(appName, JSON.stringify(data));
}

// event listeners
todoList.addEventListener('click', onClickFunction);
