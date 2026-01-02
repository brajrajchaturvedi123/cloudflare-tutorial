import { useState, useEffect } from 'react'

interface Todo {
  id: number
  text: string
  completed: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/api/todos`)
    const data = await res.json()
    setTodos(data)
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    setText('')
    fetchTodos()
  }

  const toggleTodo = async (id: number) => {
    await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PATCH'
    })
    fetchTodos()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE'
    })
    fetchTodos()
  }

  return (
    <div className="todo-page">
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed === 1}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed === 1 ? 'completed' : ''}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

