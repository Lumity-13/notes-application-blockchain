import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />         {/* Home/Landing page */}
        <Route path="/notes" element={<NotesPage />} />  {/* Notes page */}
      </Routes>
    </Router>
  );
}
