import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        setFile(null)
      } else {
        setMessage({ type: 'error', text: 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' })
    }
  }

  return (
    <div className="upload-page">
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" disabled={!file}>
          Upload Image
        </button>
      </form>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

