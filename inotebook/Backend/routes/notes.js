/* eslint-disable no-extra-semi */
/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });

        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error occured' });
    }


})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be 5 characters long').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error occured' });
    }


})

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const newNote = {};

        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(new mongoose.Types.ObjectId(req.params.id));
        console.log(req.params.id + " " + typeof req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const newNote = {};

        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(new mongoose.Types.ObjectId(req.params.id));
        console.log(req.params.id + " " + typeof req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ 'Success': 'Note has been deleted', note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router;