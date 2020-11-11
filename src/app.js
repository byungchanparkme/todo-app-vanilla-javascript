import { ColorPalette } from "./models.js"
import { TodosManagerWithLocalStorage } from "./TodosManagerWithLocalStorage.js"

class TodoApp {
  constructor(todos, colors) {
    // 데이터
    this.todosManager = new TodosManagerWithLocalStorage(todos)
    this.colorPalette = new ColorPalette(colors)
    this.mode = "read"
    this.clickedId = ""
    this.clickedColor = ""
    // 우리가 참조할 DOM 요소들
    this.paletteEl = document.querySelector(".palette")
    this.todoListEl = document.querySelector("#todo-list")
    this.subTitleEl = document.querySelector("#date")
    this.addTodoFormEl = document.querySelector("#todo-form")
    this.inputEl = document.querySelector(".todo__input")
    this.resetBtnEl = document.querySelector(".clear .reset-todos")
    // todos 데이터에 변화가 생길 때마다 화면을 리렌더링해준다.
    this.renderTodos()
    // 사용자의 입력에 대한 응답 담당(DOM 요소에 이벤트 부착)
    this.bindEvents()
    this.renderColorPalette()
    this.paletteEl.childNodes.forEach((childNode) => {
      childNode.className = childNode.id?.indexOf("0") > 0 ? "color active" : "color"
    })
  }

  renderTodos() {
    this.todoListEl.innerHTML = ""
    this.todosManager.getList().forEach((todo) => {
      const todoEl = this.createTodoEl(todo)
      this.todoListEl.appendChild(todoEl)
    })
    this.renderLeftTodo()
  }

  renderColorPalette() {
    this.colorPalette.getColors().forEach((color, i) => {
      const colorEl = document.createElement("div")
      colorEl.className = "color"
      colorEl.id = "color-" + i
      colorEl.style.backgroundColor = color
      this.paletteEl.appendChild(colorEl)
    })
  }

  createTodoEl(todo) {
    let todoEl = document.createElement("li")
    todoEl.id = "todo-" + todo.id
    todoEl.className = "todo"
    todoEl.innerHTML = `
      <i class="fas fa-tools modify"></i>
      <span style="color: ${todo.color};">${todo.text}</span>
      <i class="fas fa-trash-alt delete"></i>
    `
    return todoEl
  }

  renderLeftTodo() {
    const today = new Date()
    const month = today.getMonth() + 1
    const date = today.getDate() + 1

    if (this.subTitleEl) {
      this.subTitleEl.innerHTML = `
        ${month}월 ${date}일 <span class="left-count">(${this.todosManager.leftTodos}개 남음)</span>
      `
    }
  }

  bindEvents() {
    this.addTodoFormEl.addEventListener("submit", (evt) => {
      evt.preventDefault()

      if (this.mode === "read") {
        this.todosManager.addTodo(this.inputEl.value, false, this.clickedColor)
        this.inputEl.value = ""
      } else if (this.mode === "modify") {
        this.todosManager.updateTodo(this.clickedId, this.inputEl.value)
        this.mode = "read"
        this.clickedId = ""
        alert("다시 읽기 모드로 변경되었습니다.")
        this.inputEl.value = ""
      }
      this.renderTodos()
      this.paletteEl.childNodes.forEach((childNode) => {
        childNode.className = childNode.id?.indexOf("0") > 0 ? "color active" : "color"
      })
    })
    this.todoListEl.addEventListener("click", (evt) => {
      const clickedEl = evt.target.nodeName === "I" ? evt.target.parentNode.parentNode : evt.target.parentNode
      this.clickedId = clickedEl.id.replace("todo-", "")
      const targetTodo = this.todosManager.getList().filter((todo) => todo.id === parseInt(this.clickedId, 10))[0]
      // 수정
      if (evt.target.classList.contains("modify")) {
        this.mode = "modify"
        alert("수정 모드로 변경되었습니다.")
        this.inputEl.value = targetTodo.text
        this.inputEl.focus()
        // 완료
      } else if (evt.target.nodeName === "SPAN" && evt.target.parentElement.className === "todo") {
        targetTodo.toggle()
        evt.target.className = targetTodo.done ? "complete" : ""
        this.renderLeftTodo()
        // 삭제
      } else if (evt.target.classList.contains("delete")) {
        this.todosManager.deleteTodo(this.clickedId)
        this.clickedId = ""
        this.renderTodos()
      }
    })
    this.paletteEl.addEventListener("click", (evt) => {
      const paletteChildNodes = this.paletteEl.childNodes
      if (evt.target.classList.contains("color")) {
        const clickedColorEl = evt.target
        // 내가 지금 클릭한 colorBox만 active 상태가 된다.
        for (let i in paletteChildNodes) {
          if (paletteChildNodes[i].id) {
            paletteChildNodes[i].className = "color"
            if (clickedColorEl.id === paletteChildNodes[i].id) {
              clickedColorEl.classList.add("active")
              this.clickedColor = clickedColorEl.style.backgroundColor
              if (this.clickedId) {
                const targetTodo = this.todosManager.getList().filter((todo) => todo.id === parseInt(this.clickedId, 10))[0]
                targetTodo.color = this.clickedColor
                this.renderTodos()
                this.clickedId = ""
              }
            }
          }
        }
      }
    })
    this.resetBtnEl.addEventListener("click", () => {
      this.todosManager.resetTodos()
      this.renderTodos()
    })
  }
}

export default TodoApp
