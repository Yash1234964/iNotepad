/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"

    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);

    const getNotes = async () => {

        const token = localStorage.getItem('token')

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiOGJlMzQ0NGI4MTI3OTg1N2M4NTZjIn0sImlhdCI6MTY4OTgyODkxNn0.qUsJGjXgJsSaaWZg2Sy3V1IKEhAo6_lZ_unEcpT4ju4'
                // 'auth-token': `${token}`
                'auth-token': localStorage.getItem("token"),
            }
            // body: JSON.stringify({ title, description, tag })
        });

        // const note = {
        //     "_id": "64b8f4b40bd7870db977645tgtretre",
        //     "user": "64b8be3444b81279857c856ctret",
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": "2023-07-20T08:47:48.323Z",
        //     "__v": 0
        // };
        // setNotes(notes.concat(note));
        const json = await response.json();
        console.log(json);
        setNotes(json)
    }

    const addNote = async (title, description, tag) => {
        // const token = localStorage.getItem('token')


        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem("token"),

            }, body: JSON.stringify({ title, description, tag }),
        })

        const newNote = await response.json();
        setNotes(notes.concat(newNote));
    }

    const deleteNote = async (id) => {
        const token = localStorage.getItem('token')

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem("token")

            }
        });
        const json = response.json();
        console.log(json);
        console.log("Deleting node with id " + id);
        const newNotes = notes.filter((notes) => { return notes._id !== id });
        setNotes(newNotes);
    }

    const editNote = async (id, title, description, tag) => {


        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem("token"),

            }, body: JSON.stringify({ title, description, tag }),
        })
        const json = await response.json();

        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);

    }


    return (
        <NoteContext.Provider value={{ notes, deleteNote, editNote, getNotes, addNote }}>
            {props.children}
        </NoteContext.Provider>
    )
};

export default NoteState;