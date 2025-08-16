import Notes from "../models/Notes.js";
export async function getAllNotes(req,res){
    try{
        const notes = await Notes.find();
        res.status(200).json(notes);
    }
    catch(error){
        res.status(500).json({message: "Error fetching notes"});
        console.error("fetched successfully",error)
    }
}
export function getNoteById(req,res){
    console.log("Here is Id ")
}

export function createNote(req,res){
    res.status(201).send("All notes create successfully");
}

export function updateNote(req,res){
    res.status(200).send("update successfully")
}

export function deleteNote(req,res){
    res.status(200).send("Note deleted successfully");
}