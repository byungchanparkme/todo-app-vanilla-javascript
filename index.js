window.addEventListener("load", () => {
  const todoList = document.querySelector("#todo-list")
  // 로컬 스토리지에 todos가 존재하면 그 데이터를 가져온다.
  let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []
  let id = JSON.parse(localStorage.getItem("todos")).length > 0 ? todos[todos.length - 1].id + 1 : 1
  let mode = "read"

  function addTodo() {
    const todoInput = document.querySelector(".todo__input")
    const todoForm = document.querySelector("#todo-form")

    todoForm.addEventListener("submit", (event) => {
      if (mode === "read") {
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
      }
    })
  }

  // todos data를 바탕으로 li 요소 생성해서 todo-list에 추가
  function createTodoItem(parent, todo) {
    const todoText = document.createElement("span")
    todoText.innerText = todo.text
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
      const todoInput = document.querySelector(".todo__input")
      const todoForm = document.querySelector("#todo-form")
      // mode가 modify mode로 바뀐다.
      // 수정 모드로 변경되었습니다라는 경고창을 띄워준다.
      alert("수정 모드로 변경되었습니다.")
      mode = "modify"
      // input에 해당 text가 보인다.
      let target = todos.filter((todo) => todo.id === parseInt(itemId, 10))[0]
      todoInput.value = target.text

      // input value를 입력하고 Add 버튼 누르면
      todoForm.addEventListener("submit", function (event) {
        if (mode === "modify") {
          event.preventDefault()
          const todoInput = document.querySelector(".todo__input")

          // 수정한 input value를 어떻게 가져올 것인가?
          // todos 배열에 있는 텍스트도 수정된다.
          todos = todos.map((todo) => (todo.id === parseInt(itemId, 10) ? { id: todo.id, text: todoInput.value, done: false } : todo))

          // 화면에 있는 해당 todo의 텍스트가 수정된다.
          // childNodes 중에서 id 값을 이용해서 제거할 자식 요소를 찾는다.
          const todoItemNodes = todoList.childNodes
          let targetIndex = 0
          for (let i = 0; i < todoItemNodes.length; i++) {
            if (todoItemNodes[i].id === itemId) {
              targetIndex = i
              break
            }
          }

          const span = document.createElement("span")
          span.innerText = todoInput.value
          todoItemNodes[targetIndex].replaceChild(span, todoItemNodes[targetIndex].childNodes[1])
          // 로컬 스토리지에 반영된다.
          localStorage.setItem("todos", JSON.stringify(todos))
          // reset input value
          todoInput.value = ""
          mode = "read"
          alert("다시 읽기 모드로 변경합니다.")
        }
      })
    })

    // 완료 여부 체크 이벤트
    todoText.addEventListener("click", function () {
      const itemId = this.parentNode.id
      completeTodo(itemId)

      // 할일 완료
      if (this.className === "") {
        this.className = "complete"

        // 할일 아직 완료되지 않음
      } else {
        this.className = ""
      }
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
    // 데이터에서 delete된 요소 제거
    todos = todos.filter((todo) => todo.id != parseInt(id, 10))

    // childNodes 중에서 id 값을 이용해서 제거할 자식 요소를 찾는다.
    const todoItemNodes = todoList.childNodes
    let targetIndex = 0
    for (let i = 0; i < todoItemNodes.length; i++) {
      if (todoItemNodes[i].id === id) {
        targetIndex = i
        break
      }
    }
    // 화면에서 delete 된 요소 제거
    todoList.removeChild(todoItemNodes[targetIndex])
    // 로컬 스토리지에도 반영
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  function completeTodo(id) {
    // 데이터에서 완료 여부 조작
    todos = todos.map((todo) => (todo.id === parseInt(id, 10) ? { ...todo, done: !todo.done } : todo))

    // 로컬 스토리지에도 반영
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  showTodos()
  addTodo()
})
