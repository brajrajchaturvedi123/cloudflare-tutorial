import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Env = {
  DB: D1Database
  BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors())

app.get('/api/todos', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM todos ORDER BY id DESC').all()
  return c.json(results)
})

app.post('/api/todos', async (c) => {
  const { text } = await c.req.json()
  if (!text || typeof text !== 'string') {
    return c.json({ error: 'Text is required' }, 400)
  }
  
  await c.env.DB.prepare('INSERT INTO todos (text, completed) VALUES (?, ?)')
    .bind(text, 0)
    .run()
  
  return c.json({ success: true })
})

app.patch('/api/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ error: 'Invalid ID' }, 400)
  }
  
  const todo = await c.env.DB.prepare('SELECT completed FROM todos WHERE id = ?').bind(id).first()
  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404)
  }
  
  const newCompleted = todo.completed === 0 ? 1 : 0
  await c.env.DB.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    .bind(newCompleted, id)
    .run()
  
  return c.json({ success: true })
})

app.delete('/api/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) {
    return c.json({ error: 'Invalid ID' }, 400)
  }
  
  await c.env.DB.prepare('DELETE FROM todos WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

app.post('/api/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('image') as File
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400)
  }
  
  const filename = `${Date.now()}-${file.name}`
  await c.env.BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type
    }
  })
  
  return c.json({ success: true, filename })
})

export default app

