import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountDropdown from "../components/AccountDropdown";
import LoginPopup from "../components/LoginPopup";
import RegisterPopup from "../components/RegisterPopup";
import { useAuth } from "../context/AuthContext";
import "../css/Landing.css"; // Your custom CSS

const Landing = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDropdownToggle = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };
    const closeDropdowns = () => setOpenDropdown(null);

    const handleLoginClick = () => { setShowLoginPopup(true); closeDropdowns(); };
    const handleRegisterClick = () => { setShowRegisterPopup(true); closeDropdowns(); };
    const handleCloseLogin = () => setShowLoginPopup(false);
    const handleCloseRegister = () => setShowRegisterPopup(false);
    const handleSwitchToRegister = () => { setShowLoginPopup(false); setShowRegisterPopup(true); };
    const handleSwitchToLogin = () => { setShowRegisterPopup(false); setShowLoginPopup(true); };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const header = document.querySelector(".header");
            if (header && !header.contains(event.target)) closeDropdowns();
        };
        if (openDropdown) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [openDropdown]);

    const notes = [
        {
            id: 1,
            title: "Test",
            date: "12/12/2021",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            color: "#fef08a",
        },
        {
            id: 2,
            title: "Mid test exam",
            date: "12/12/2021",
            text: "Ultrices viverra odio congue lecos felis...",
            color: "#fecaca",
        },
        {
            id: 3,
            title: "Jonas’s notes",
            date: "12/12/2021",
            text: "Rokity viverra odio congue lecos felis...",
            color: "#bfdbfe",
        },
    ];

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">Notes App</div>
                <nav className="sidebar-nav">
                    <button>📅 Calendar</button><br />
                    <button>🗑 Trash</button>
                </nav>
            </aside>

            {/* Main */}
            <main className="main">
                {/* Top bar */}
                <header className="topbar">
                    <input className="search" type="text" placeholder="Search notes..." />
                    <div className="account-section" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {/* Username displayed beside the icon */}
                        {user && (
                            <span style={{ fontWeight: 500 }}>{user.username}</span>
                        )}

                        {/* Account dropdown button */}
                        <button className="account-button"
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownToggle("account"); }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* AccountDropdown changes if logged in */}
                        <AccountDropdown
                            isOpen={openDropdown === "account"}
                            onClose={closeDropdowns}
                            onLoginClick={handleLoginClick}
                            onRegisterClick={handleRegisterClick}
                            user={user}
                            logout={logout}
                        />
                    </div>
                </header>

                {/* Notes */}
                <section className="notes-section">
                    <h2 className="section-title">My Notes</h2>
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="note-card"
                                style={{ backgroundColor: note.color }}
                            >
                                <div className="note-date">{note.date}</div>
                                <h3 className="note-title">{note.title}</h3>
                                <p className="note-text">{note.text}</p>
                            </div>
                        ))}
                        <button
                            className="note-card new-note"
                            onClick={() => navigate("/notes")}
                        >
                            + New Note
                        </button>
                    </div>
                </section>
            </main>
            {/* Auth Popups */}
            <LoginPopup isOpen={showLoginPopup} onClose={handleCloseLogin} onSwitchToRegister={handleSwitchToRegister} />
            <RegisterPopup isOpen={showRegisterPopup} onClose={handleCloseRegister} onSwitchToLogin={handleSwitchToLogin} />
        </div>
    );
};

export default Landing;
