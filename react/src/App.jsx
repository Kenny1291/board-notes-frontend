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
    const tempId = `temp-${Date.now()}`
    console.log(tempId);
    const tempNote = {
      id: tempId,
      x_coordinate: x,
      y_coordinate: y,
    }
    setNotes(oldNotes => [...oldNotes, tempNote])

    axiosClient.post('/notes', {x_coordinate: x, y_coordinate: y})
      .then(response => {
        console.log(response.data);
        setNotes(oldNotes => oldNotes.map(note => note.id === tempId 
          ? response.data 
          : note))
      })
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
    <p className='text-center select-none'>Double click to create a note. Notes are saved based on IP address.</p>
    {notes.map((note) => <Note note={note} key={note.id} onContentChange={handleContentChange} fetchNotes={fetchNotes} />)}
    </>
  )
}

export default App
