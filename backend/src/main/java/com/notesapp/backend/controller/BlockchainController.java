package com.notesapp.backend.controller;

import com.notesapp.backend.model.Block;
import com.notesapp.backend.repository.BlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blocks")
public class BlockchainController {

    @Autowired
    private BlockRepository blockRepository;

    // --- Get all blocks ---
    @GetMapping
    public List<Block> getAllBlocks() {
        return blockRepository.findAll();
    }

    // --- Get a block by ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Block> getBlockById(@PathVariable Long id) {
        return blockRepository.findById(id)
                .map(block -> ResponseEntity.ok(block))
                .orElse(ResponseEntity.notFound().build());
    }
}
