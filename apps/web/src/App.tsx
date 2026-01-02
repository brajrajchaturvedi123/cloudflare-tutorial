import { useState } from 'react'
import TodoPage from './pages/TodoPage'
import UploadPage from './pages/UploadPage'

function App() {
  const [page, setPage] = useState<'todo' | 'upload'>('todo')

  return (
    <div className="app">
      <nav>
        <button onClick={() => setPage('todo')} className={page === 'todo' ? 'active' : ''}>
          Todos
        </button>
        <button onClick={() => setPage('upload')} className={page === 'upload' ? 'active' : ''}>
          Upload
        </button>
      </nav>
      {page === 'todo' ? <TodoPage /> : <UploadPage />}
    </div>
  )
}

export default App

