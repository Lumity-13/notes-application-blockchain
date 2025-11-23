import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Landing.css";

import { useAuth } from "../context/AuthContext";

import Wallet from "./Wallet";
import Profile from "./Profile";

const Landing = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("notes"); // notes | wallet | profile

    const { user, logout } = useAuth();   // <-- includes token remover
    const navigate = useNavigate();

    const handleDropdownToggle = () => {
        setOpenDropdown(!openDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest('.account-section')) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openDropdown]);

    const notes = [
        { id: 1, title: "Test", date: "12/12/2021", text: "Lorem ipsum dolor sit amet...", color: "#fef08a" },
        { id: 2, title: "Mid test exam", date: "12/12/2021", text: "Ultrices viverra odio congue...", color: "#fecaca" },
        { id: 3, title: "Jonas's notes", date: "12/12/2021", text: "Rokity viverra odio congue...", color: "#bfdbfe" }
    ];

    // ================================
    // LOGOUT HANDLER
    // Clears token + user data
    // Redirects to login
    // ================================
    const handleLogout = () => {
        logout();   // clears token + user from AuthContext & localStorage
        navigate("/login", { replace: true });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">

                {/* Header */}
                <div className="sidebarHeader">
                    <div className="logoSection">
                        <div className="logoIcon">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="8" fill="#6366F1" />
                                <path d="M15 12h10M15 20h10M15 28h6"
                                      stroke="white" strokeWidth="2.5"
                                      strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="logoText">
                            <div className="logoTitle">Notes App</div>
                            <div className="logoSubtitle">Personal workspace</div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="searchBox">
                    <svg className="searchIcon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round"/>
                    </svg>
                    <input type="text" placeholder="Search..." className="searchInput" />
                </div>

                {/* Navigation */}
                <nav className="nav">
                    <button
                        className={`navItem ${activeTab === "notes" ? "navItemActive" : ""}`}
                        onClick={() => setActiveTab("notes")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>Notes</span>
                    </button>

                    <button
                        className={`navItem ${activeTab === "wallet" ? "navItemActive" : ""}`}
                        onClick={() => setActiveTab("wallet")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="7" width="20" height="14" rx="2"
                                   stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                                  stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Wallet</span>
                    </button>

                    <button
                        className={`navItem ${activeTab === "profile" ? "navItemActive" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 21a9 9 0 0 1 18 0" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Profile</span>
                    </button>
                </nav>

                {/* Bottom */}
                <div className="sidebarBottom">
                    <button className="loginButton" onClick={handleLogout}>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main">
                {activeTab === "notes" && (
                    <section className="notesSection">
                        <h2 className="sectionTitle">My Notes</h2>

                        <div className="notesGrid">
                            {notes.map((note) => (
                                <div key={note.id}
                                     className="noteCard"
                                     style={{ backgroundColor: note.color }}>
                                    <div className="noteDate">{note.date}</div>
                                    <h3 className="noteTitle">{note.title}</h3>
                                    <p className="noteText">{note.text}</p>
                                </div>
                            ))}
                            <button className="newNote">+ New Note</button>
                        </div>
                    </section>
                )}

                {activeTab === "wallet" && (
                    <div className="walletContainer">
                        <Wallet />
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="profileContainer">
                        <Profile />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Landing;
