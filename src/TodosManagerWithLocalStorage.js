import { TodosManager } from "./models.js"

export class TodosManagerWithLocalStorage extends TodosManager {
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

  resetTodos() {
    super.resetTodos()
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    const todosJSON = JSON.stringify(this._todos)
    localStorage.setItem(TodosManagerWithLocalStorage.STORAGE_KEY, todosJSON)
  }
}
