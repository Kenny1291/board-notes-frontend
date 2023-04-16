import { useCallback, useEffect, useRef } from "react"
import axiosClient from "../axios"
import { debounce, entries } from "lodash"
import Draggable from 'react-draggable'

export default function Note({note, onContentChange, onNoteDelete, setZIndex}) {

    const textareaRef = useRef(null)

    const sendUpdateRequest = useCallback(
        debounce((id, obj) => {
        axiosClient.put(`/notes/${id}`, obj)
      }, 1000),
      [])

    const updateContent = (e) => {
        onContentChange(note.id, e.target.value)
        sendUpdateRequest(note.id, {content: e.target.value})
    }

    //e arg is required to maintain correct position on page load...
    const savePosition = (e, data) => {
        axiosClient.put(`/notes/${note.id}`, {x_coordinate: data.x, y_coordinate: data.y})
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0]
            sendUpdateRequest(note.id, {width: entry.borderBoxSize[0].inlineSize, height: entry.contentRect.height})
        })
        resizeObserver.observe(textareaRef.current)
        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    useEffect(() => {
        textareaRef.current.style.width = `${note.width}px`
        textareaRef.current.style.height = `${note.height}px`
    })

    const handleDoubleClick = (e) => {
        e.stopPropagation()
        setZIndex(note.id)
    }

    const deleteNote = () => {
        onNoteDelete(note.id)
        axiosClient.delete(`/notes/${note.id}`)
    }
      
    return (
        <Draggable
            handle=".handle"
            onStop={savePosition}
            defaultPosition={{x: note.x_coordinate, y: note.y_coordinate}}
            bounds= "body"
        >
            <div className="w-fit h-fit mt-5 absolute" style={{zIndex: note.z_index}} onDoubleClick={handleDoubleClick}>
                <div className="flex backdrop-blur-sm mx-4">
                    <div className="basis-1/3"></div>
                    <div className="handle hover:cursor-grab active:cursor-grabbing basis-1/3 text-center"><span className="material-icons-round">drag_handle</span></div>
                    <div className="basis-1/3 text-center"><span className="material-icons-round cursor-pointer" onClick={deleteNote}>delete_forever</span></div>
                </div>
                <textarea className="bg-yellow-note mx-4 mb-4 p-5 min-h-[13rem] shadow-xl resize" type="text" value={note.content} onChange={updateContent} ref={textareaRef} />
            </div>
        </Draggable>
    )
}