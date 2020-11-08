window.addEventListener("load", () => {
  const todoInput = document.querySelector(".todo__input")
  const todoForm = document.querySelector("#todo-form")
  const todoList = document.querySelector("#todo-list")

  let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []
  let id = localStorage.getItem("todos") && JSON.parse(localStorage.getItem("todos")).length > 0 ? todos[todos.length - 1].id + 1 : 1
  let mode = "read"
  let clickedColor = ""
  let clickedItemNumber = ""

  function addTodo(event) {
    event.preventDefault()
    if (mode === "read") {
      const todo = { id: id++, text: todoInput.value, done: false, color: clickedColor }
      todos.push(todo)

      localStorage.setItem("todos", JSON.stringify(todos))

      todoInput.value = ""

      createTodoItem(todoList, todo)
    }
  }

  todoForm.addEventListener("submit", addTodo)

  // todos data를 바탕으로 li 요소 생성해서 todo-list에 추가
  function createTodoItem(parent, todo) {
    const todoText = document.createElement("span")
    todoText.innerText = todo.text
    todoText.style.color = todo.color
    const deleteText = document.createElement("i")
    deleteText.className = "fas fa-trash-alt"
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "delete"
    deleteBtn.appendChild(deleteText)
    const modifyText = document.createElement("i")
    modifyText.className = "fas fa-tools"
    const modifyBtn = document.createElement("button")
    modifyBtn.appendChild(modifyText)
    modifyBtn.className = "modify"
    const li = document.createElement("li")
    li.appendChild(modifyBtn)
    li.appendChild(todoText)
    li.appendChild(deleteBtn)
    li.id = todo.id
    parent.appendChild(li)

    // 수정 모드 이벤트
    modifyBtn.addEventListener("click", function () {
      const itemId = this.parentNode.id
      const todoItemNodes = todoList.childNodes
      const todoItemLength = todoItemNodes.length

      mode = "modify"
      alert("수정 모드로 변경되었습니다.")
      let target = todos.filter((todo) => todo.id === parseInt(itemId, 10))[0]
      todoInput.value = target.text
      todoInput.focus()

      let targetIndex = 0
      for (let i = 0; i < todoItemLength; i++) {
        if (todoItemNodes[i].id === itemId) {
          targetIndex = i
          break
        }
      }
      clickedItemNumber = targetIndex

      todoForm.addEventListener("submit", updateTodo)

      function updateTodo(event) {
        event.preventDefault()
        if (mode === "modify") {
          todos = todos.map((todo) => (todo.id === parseInt(itemId, 10) ? { id: todo.id, text: todoInput.value, done: false, color: clickedColor } : todo))

          const updateTodoText = document.createElement("span")
          updateTodoText.innerText = todoInput.value
          updateTodoText.style.color = clickedColor
          const todoText = todoItemNodes[targetIndex].childNodes[1]
          todoItemNodes[targetIndex].replaceChild(updateTodoText, todoText)
          localStorage.setItem("todos", JSON.stringify(todos))
          todoInput.value = ""
          mode = "read"
          alert("다시 읽기 모드로 변경합니다.")
        }
      }
    })

    // 완료 여부 체크 이벤트
    todoText.addEventListener("click", function () {
      const itemId = this.parentNode.id
      completeTodo(itemId)
      this.className = this.className === "" ? "complete" : ""
    })

    // 요소 제거 이벤트
    deleteBtn.addEventListener("click", function () {
      const itemId = this.parentNode.id
      deleteTodo(itemId)
    })
  }

  // 리로딩 시 로컬 스토리지에 저장되어 있는 todos 데이터 이용하여 todoList 출력
  function showTodos() {
    todos.forEach((todo) => {
      createTodoItem(todoList, todo)
    })
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id != parseInt(id, 10))

    const todoItemNodes = todoList.childNodes
    const todoItemLength = todoItemNodes.length
    let targetIndex = 0
    for (let i = 0; i < todoItemLength; i++) {
      if (todoItemNodes[i].id === id) {
        targetIndex = i
        break
      }
    }
    todoList.removeChild(todoItemNodes[targetIndex])

    localStorage.setItem("todos", JSON.stringify(todos))
  }

  function completeTodo(id) {
    todos = todos.map((todo) => (todo.id === parseInt(id, 10) ? { ...todo, done: !todo.done } : todo))

    localStorage.setItem("todos", JSON.stringify(todos))
  }

  function makePalette() {
    const paletteContainer = document.querySelector(".palette")
    const colors = ["#343a40", "#f03e3e", "#12b886", "#228ae6"]

    for (let i = 0; i < colors.length; i++) {
      const colorBox = document.createElement("div")
      colorBox.className = "color"
      colorBox.dataset.isClicked = "false"
      colorBox.style.backgroundColor = colors[i]
      paletteContainer.appendChild(colorBox)

      colorBox.addEventListener("click", function () {
        const clickedState = eval(this.dataset.isClicked)
        const todoItemNodes = todoList.childNodes
        const todoText = clickedItemNumber ? todoItemNodes[clickedItemNumber].childNodes[1] : null

        if (clickedState) {
          this.dataset.isClicked = "false"
          this.classList.remove("active")
          clickedColor = ""
          if (mode === "modify") todoText.style.color = ""
        } else {
          this.dataset.isClicked = "true"
          this.classList.add("active")
          clickedColor = colors[i]
          if (mode === "modify") todoText.style.color = colors[i]
        }
      })
    }
  }
  makePalette()
  showTodos()
})
