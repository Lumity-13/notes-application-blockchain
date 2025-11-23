import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import NotesPage from "./pages/NotesPage";
import Login from "./pages/Login"; // <-- import login page
const Wallet = lazy(() => import("./pages/Wallet"));

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Default route → go to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* After login pages */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route
          path="/wallet"
          element={
            <Suspense fallback={<div>Loading Wallet...</div>}>
              <Wallet />
            </Suspense>
          }
        />

      </Routes>
    </Router>
  );
}
