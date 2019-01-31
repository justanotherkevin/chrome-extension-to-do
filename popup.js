// Future JavaScript will go here
console.clear();
console.log(localStorage);




class Task {
  constructor(desc) {
    this.desc = desc
    this.fin = false
  }

  toggleFin() {
    this.fin = !this.fin;
  }
}




const createTodoEle = (text) => {
  const todo = document.createElement('div');
  todo.innerHTML = `
    <label class="todo">
      <input class="todo__state" type="checkbox" />

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

      <div class="todo__text">${text}</div>
      <span class="todo__close" action="delete-todo">❌</span>
    </label>
  `;
  return todo
}
const appendEleToTodoListEle = (domEle) => {
  let todoList = document.getElementById('todo-list');
  todoList.appendChild( domEle );
}

function dataIntoTodoList(tasks) {
  tasks.forEach( task => {
    console.log( createTodoEle (task.desc) )
    appendEleToTodoListEle( createTodoEle( task.desc ) )
  })
}
// let data = {
//   daily: [ 
//     new Task('do stuff'),
//     new Task('do stuff'),
//     new Task('do stuff'),
//   ]
// };

// dataIntoTodoList(data.daily);

if ( localStorage.getItem('dail-goal') ) {
  // when there are stored data 
  let data = JSON.parse( localStorage.getItem('dail-goal') );
  dataIntoTodoList(data.daily);
} else {
  // no stored data 
  let data = {
    daily: [ 
      new Task('do stuff'),
      new Task('do stuff'),
      new Task('do stuff'),
    ]
  };
  localStorage.setItem('dail-goal', JSON.stringify(data) )
}

