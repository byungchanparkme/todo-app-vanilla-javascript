class TodoItem {
  constructor(id, text, done, color) {
    this.id = id
    this.text = text
    this.done = done
    this.color = color
  }
  toggle() {
    this.done = !this.done
  }
}

class TodosManager {
  constructor(todos = []) {
    this._todos = []
    this._id = 1
    todos.forEach((todo) => {
      this.addTodo(todo.text, todo.done, todo.color)
    })
  }

  addTodo(text, done = false, color = "#000") {
    const newTodo = new TodoItem(this._id, text, done, color)
    this._todos.push(newTodo)
    this._id++
    return newTodo
  }

  updateTodo(id, text) {
    this._todos = this._todos.map((todo) => (todo.id === parseInt(id, 10) ? { ...todo, text } : todo))
  }

  deleteTodo(id) {
    this._todos = this._todos.filter((todo) => todo.id !== parseInt(id, 10))
  }

  getList() {
    return this._todos
  }

  get leftTodos() {
    return this._todos.reduce((p, c) => {
      return !c.done ? ++p : p
    }, 0)
  }
}

class ColorPalette {
  constructor(colors) {
    this._colors = []
    colors.forEach((color) => {
      this._colors.push(color)
    })
  }

  getColors() {
    return this._colors
  }
}

class TodosManagerWithLocalStorage extends TodosManager {
  static get STORAGE_KEY() {
    return "todos"
  }

  constructor() {
    const todosJSON = localStorage.getItem(TodosManagerWithLocalStorage.STORAGE_KEY)
    const todos = todosJSON ? JSON.parse(todosJSON) : []
    super(todos)
  }

  addTodo(text, done = false, color = "#000") {
    const newTodo = super.addTodo(text, done, color)
    const original = newTodo.toggle
    newTodo.toggle = () => {
      original.apply(newTodo)
      this.saveToLocalStorage()
    }
    this.saveToLocalStorage()
    return newTodo
  }

  deleteTodo(id) {
    super.deleteTodo(id)
    this.saveToLocalStorage()
  }

  updateTodo(id, text) {
    super.updateTodo(id, text)
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    const todosJSON = JSON.stringify(this._todos)
    localStorage.setItem(TodosManagerWithLocalStorage.STORAGE_KEY, todosJSON)
  }
}

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
    this.subTitleEl = document.querySelector(".todo-title h2")
    this.addTodoFormEl = document.querySelector("#todo-form")
    this.inputEl = document.querySelector(".todo__input")
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
      <button class="modify"><i class="fas fa-tools"></i></button>
      <span style="color: ${todo.color};">${todo.text}</span>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
    `
    return todoEl
  }

  renderLeftTodo() {
    const today = new Date()
    const month = today.getMonth() + 1
    const date = today.getDate() + 1
    if (this.subTitleEl) {
      this.subTitleEl.innerHTML = `
        ${month}월 ${date}일 <span class="left-count">${this.todosManager.leftTodos}개 남음.</span>
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
      if (evt.target.className === "fas fa-tools" || evt.target.className === "modify") {
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
      } else if (evt.target.className === "fas fa-trash-alt" || evt.target.className === "delete") {
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
  }
}
