window.addEventListener("load", () => {
  const todoList = document.querySelector("#todo-list")
  let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []
  let id = localStorage.getItem("todos") ? todos[todos.length - 1].id + 1 : 1

  function addTodo() {
    const todoInput = document.querySelector(".todo__input")
    const todoForm = document.querySelector("#todo-form")

    todoForm.addEventListener("submit", (event) => {
      // prevent reloading
      event.preventDefault()
      const todo = { id: id++, text: todoInput.value, done: false }
      // add todo data in the todos array
      todos.push(todo)
      // store todos data in the localStorage
      localStorage.setItem("todos", JSON.stringify(todos))

      // reset input value
      todoInput.value = ""

      // 새로 추가되는 todo item을 화면에 보여준다.
      createTodoItem(todoList, todo)
    })
  }

  // todos data를 바탕으로 li 요소 생성해서 todo-list에 추가
  function createTodoItem(parent, todo) {
    const span = document.createElement("span")
    span.innerText = todo.text
    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "delete"
    const li = document.createElement("li")
    li.appendChild(span)
    li.appendChild(deleteBtn)
    li.id = "item" + todo.id
    parent.appendChild(li)
  }

  // 리로딩 시 로컬 스토리지에 저장되어 있는 todos 데이터 이용하여 todoList 출력
  function showTodos() {
    todos.forEach((todo) => {
      createTodoItem(todoList, todo)
    })
  }

  showTodos()
  addTodo()
})
