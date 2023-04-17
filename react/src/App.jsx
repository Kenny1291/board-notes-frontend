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
    const tempNote = {
      id: tempId,
      x_coordinate: x,
      y_coordinate: y,
    }
    setNotes(oldNotes => [...oldNotes, tempNote])

    axiosClient.post('/notes', {x_coordinate: x, y_coordinate: y})
      .then(response => {
        setNotes(oldNotes => oldNotes.map(note => note.id === tempId 
          ? {...response.data, content: note.content}
          : note))
      })
  }

  useEffect(() => {
    const handleDoubleClick = (e) => {
      createNewNote(e.pageX - 276/2, e.pageY - 256/2)
    }
    document.body.addEventListener('dblclick', handleDoubleClick)
    return () => {
      document.body.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [])

  const handleNoteDelete = (noteId) => {
    setNotes(oldNotes => oldNotes.filter(oldNote => oldNote.id !== noteId))
  }

  const findHighestZIndex = () => [...document.querySelectorAll('*')]
  .reduce((highest, el) => {
    const zindex = Number(getComputedStyle(el).getPropertyValue('z-index'));
    return zindex > highest ? zindex : highest;
  }, 0);

  const setZIndex = (noteId) => {
    const highestZIndex = findHighestZIndex() + 1
    setNotes(oldNotes => oldNotes.map(note => note.id === noteId
        ? {...note, z_index: highestZIndex}
        : note))
    axiosClient.put(`/notes/${noteId}`, {z_index: highestZIndex})
  }

  return (
    <>
    <p className='text-center select-none'>Double click on board to create a note. | Double click on a note to bring it on top. | Notes are saved based on IP address.</p>
    {notes.map((note) => <Note 
                            note={note} 
                            key={note.id} 
                            onContentChange={handleContentChange} 
                            fetchNotes={fetchNotes} 
                            onNoteDelete={handleNoteDelete} 
                            setZIndex={setZIndex}
                          />)}
    <div className='absolute bottom-0 right-0 flex items-center text-xs'>
      <p className='mr-1'>Source code</p>  
      <a href="https://github.com/Kenny1291/board-notes-frontend" target='_blank'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 
    </div>
    </>
  )
}

export default App
