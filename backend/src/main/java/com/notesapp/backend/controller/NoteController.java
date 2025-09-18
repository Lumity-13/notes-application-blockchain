package com.notesapp.backend.controller;

import com.notesapp.backend.model.Note;
import com.notesapp.backend.model.User;
import com.notesapp.backend.repository.BlockRepository;
import com.notesapp.backend.repository.NoteRepository;
import com.notesapp.backend.repository.UserRepository;
import com.notesapp.backend.util.HashUtil;
import com.notesapp.backend.model.Block;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockRepository blockRepository;

    // --- Get all notes ---
    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    // --- Get all notes by a specific user ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getNotesByUser(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(noteRepository.findByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Create note ---
    @PostMapping("/user/{userId}")
    public ResponseEntity<Note> createNote(@PathVariable Long userId, @RequestBody Note note) {
        return userRepository.findById(userId)
                .map(user -> {
                    note.setUser(user);
                    Note savedNote = noteRepository.save(note);

                    // Blockchain step
                    Block previousBlock = blockRepository.findTopByOrderByBlockIdDesc();
                    String previousHash = (previousBlock != null) ? previousBlock.getHash() : "0"; // Genesis block if none
                    String dataToHash = savedNote.getNoteId() 
                            + savedNote.getContent() 
                            + savedNote.getUser().getUserId() 
                            + previousHash;
                    String newHash = HashUtil.sha256(dataToHash);

                    Block newBlock = new Block(savedNote, previousHash, newHash);
                    blockRepository.save(newBlock);
                    blockRepository.save(newBlock);

                    return ResponseEntity.ok(savedNote);
                }).orElse(ResponseEntity.notFound().build());
    }


    // --- Delete note ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        return noteRepository.findById(id)
                .map(note -> {
                    noteRepository.delete(note);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
