package com.notesapp.backend.controller;

import com.notesapp.backend.model.Note;
import com.notesapp.backend.model.User;
import com.notesapp.backend.repository.NoteRepository;
import com.notesapp.backend.repository.UserRepository;
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

    // --- Get all notes ---
    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    // --- Get notes by user ---
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
                    return ResponseEntity.ok(noteRepository.save(note));
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
