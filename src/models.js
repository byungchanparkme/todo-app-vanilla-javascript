export class TodoItem {
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

export class TodosManager {
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

export class ColorPalette {
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
