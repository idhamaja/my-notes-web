import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    res.status(200).json({
      notes,
      message: "Notes fetched successfully Boss!!",
    });
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, date } = req.body;

    const dateObj = new Date(date);

    const formattedDate = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newNote = new Note({
      title,
      content,
      date: formattedDate,
    });

    const savedNote = await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfully!", note: savedNote });
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, date } = req.body;

    let formattedDate;

    if (date) {
      const dateObj = new Date(date);

      if (isNaN(dateObj)) {
        return res.status(400).json({ message: "Format tanggal tidak valid" });
      }

      formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        ...(formattedDate && { date: formattedDate }),
      },
      {
        new: true,
      },
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({message: "Note updated successfully!", note: updatedNote});
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
