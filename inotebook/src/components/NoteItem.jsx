/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import noteContext from "../context/notes/noteContext";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';


export const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;

    const { note, updateNote } = props

    return (
        <>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <h5 className="card-title">{note.title}</h5>

                            <FontAwesomeIcon icon={faTrash} className="mx-2" style={{ cursor: "pointer" }} onClick={() => {
                                deleteNote(note._id)
                                props.showAlert("deleted successfully", "success");
                            }} />
                            <FontAwesomeIcon icon={faPenToSquare} className="mx-2" style={{ cursor: "pointer" }} onClick={() => {
                                updateNote(note)

                            }} />
                        </div>
                        <p className="card-text">  {note.description}</p>
                    </div>

                </div>
            </div>
        </>
    );
}
