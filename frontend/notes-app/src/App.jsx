import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import NotesPage from "./pages/NotesPage";
const Wallet = lazy(() => import("./pages/Wallet"));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
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