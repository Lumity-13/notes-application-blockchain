# Notes Application with Blockchain

**CSIT360 - Blockchain Project** | *Demonstrating blockchain concepts through a practical notes application*

---

## Overview

This project implements a **decentralized notes application** that integrates fundamental blockchain principles. Each note is cryptographically linked to a blockchain block, creating an immutable ledger that ensures data integrity and demonstrates distributed ledger technology. It showcases how blockchain can be applied beyond cryptocurrencies by providing a secure and transparent way to store and manage personal notes. Users can create, view, and manage notes while experiencing how each entry becomes part of an immutable blockchain ledger, ensuring permanent and verifiable recordkeeping.

### Key Features
- Cryptographic hash linking between blocks
- User-based note management system  
- Blockchain validation and integrity checks
- Data tamper detection through hash verification

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js |
| **Backend** | Spring Boot (Java 21, Maven) |
| **Database** | PostgreSQL 17.6 |
| **Version Control** | GitHub |

---

## Project Structure

```
notes-application-blockchain/
├── backend/          # Spring Boot API server
├── frontend/         # React.js client application  
├── database/         # PostgreSQL schema & scripts
└── README.md         # Project documentation
```

---

## Development Team

*2AM Discord Decision*

- **Cantiller, Christian Jayson J.**
- **Diva, Justin Andry N.** *(Frontend Dev)*
- **Lada, Nathan Xander** *(Backend Lead)*
- **Go, Felix Christian T.**

---

## Quick Start

### Prerequisites
- Java 21+ installed
- Node.js 16+ installed
- PostgreSQL 17.6 installed
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/Lumity-13/notes-application-blockchain.git
cd notes-application-blockchain
```

### 2. Database Setup

#### Step 1: Install & Launch PostgreSQL 17.6

#### Step 2: Create Database via pgAdmin
1. Open pgAdmin → PostgreSQL 17 → Right-click "Databases" → Create
2. Database name: `notes_app`

#### Step 3: Initialize Schema
1. Right-click `notes_app` → Query Tool
2. Execute the following SQL:

```sql
-- Create application tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blockchain_ledger (
    block_id SERIAL PRIMARY KEY,
    note_id INT NOT NULL REFERENCES notes(note_id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previous_hash VARCHAR(255),
    hash VARCHAR(255) NOT NULL
);
```

#### Step 4: Verify Installation
```sql
-- Verify tables exist
SELECT * FROM users;
SELECT * FROM notes;
SELECT * FROM blockchain_ledger;
```

### 3. Launch Backend
```bash
cd backend/
./mvnw spring-boot:run
```
*Server runs on: http://localhost:8080*

### WARNING: PLACEHOLDER
### 4. Launch Frontend 
```bash
cd frontend/
npm install
npm start
```
*Client runs on: http://localhost:3000*
### WARNING: PLACEHOLDER

---

## API Testing with Postman

### Core Endpoints

#### 1. Create User
```http
POST http://localhost:8080/users
Content-Type: application/json

{
  "username": "nathan",
  "email": "nathan@example.com", 
  "password": "12345"
}
```

#### 2. Add Note (Creates Blockchain Block)
```http
POST http://localhost:8080/notes/user/1
Content-Type: application/json

{
  "content": "First blockchain note"
}
```

#### 3. View Blockchain
```http
GET http://localhost:8080/blocks
```

#### 4. Validate Chain Integrity
```http
GET http://localhost:8080/blocks/validate
```

---

## Development Utilities

### Database Reset (Development Only)
```sql
-- Clear all data and reset auto-increment IDs
TRUNCATE TABLE blockchain_ledger RESTART IDENTITY CASCADE;
TRUNCATE TABLE notes RESTART IDENTITY CASCADE; 
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
```

---

## How It Works

1. **User Registration**: Users create accounts to manage their notes
2. **Note Creation**: Each new note automatically generates a blockchain block
3. **Hash Linking**: Blocks are cryptographically linked using SHA-256 hashes
4. **Chain Validation**: The system can verify the entire blockchain's integrity
5. **Tamper Detection**: Any modification to historical data breaks the chain
