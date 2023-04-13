import { useState, useEffect } from 'react'
import Note from "./components/Note"
import axiosClient from './axios'

function App() {

  const [notes, setNotes] = useState([])

  const fetchNotes = () => {
    axiosClient.get('/notes')
    .then(response => {
      setNotes(response.data)
    })
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleContentChange = (noteId, noteNewContent) => {
    setNotes(oldNotes => oldNotes.map(note => note.id === noteId 
      ? {...note, content: noteNewContent} 
      : note))
  }

  const createNewNote = (x, y) => {
    axiosClient.post('/notes', {x_coordinate: x, y_coordinate: y})
      .then(fetchNotes)
  }

  useEffect(() => {
    const handleDoubleClick = (e) => {
      createNewNote(e.pageX, e.pageY)
    }
    document.body.addEventListener('dblclick', handleDoubleClick)
    return () => {
      document.body.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [])

  return (
    <>
    {notes.map((note) => <Note note={note} key={note.id} onContentChange={handleContentChange} fetchNotes={fetchNotes} />)}
    </>
  )
}

export default App
