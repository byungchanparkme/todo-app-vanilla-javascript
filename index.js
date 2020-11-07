const todos = []
let id = 1

function addTodo() {
  const todoInput = document.querySelector(".todo__input")
  const todoForm = document.querySelector("#todo-form")

  todoForm.addEventListener("submit", (event) => {
    // prevent reloading
    event.preventDefault()
    console.log(todoInput.value)
    const todo = { id: id++, text: todoInput.value, done: false }
    // add todo data in the todos array
    todos.push(todo)

    // reset input value
    todoInput.value = ""

    // store todos data in the localStorage
    localStorage.setItem("todos", JSON.stringify(todos))
  })
}

window.addEventListener("load", () => {
  addTodo()
})
