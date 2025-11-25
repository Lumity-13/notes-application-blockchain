// src/pages/Profile.jsx
import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../css/Profile.css";

export default function Profile() {
  const { user, setUser } = useAuth();

  // DEBUG: see user object
  console.log("PROFILE USER:", user);

  // Local states
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);

  // Use actual Cloudinary URL or default
  const [preview, setPreview] = useState(
    user?.avatarUrl ? user.avatarUrl : "/default-avatar.png"
  );

  // -------------------------------------
  // Upload IMG → Cloudinary (unsigned)
  // -------------------------------------
  const uploadToCloudinary = async () => {
    if (!avatarFile) return user?.avatarUrl || null;

    const formData = new FormData();
    formData.append("file", avatarFile);
    formData.append("upload_preset", "notes_avatar_preset"); // your unsigned preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkoc2gprs/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("CLOUDINARY RESPONSE:", data);

      return data.secure_url; // Cloudinary URL
    } catch (err) {
      console.error("Cloudinary error:", err);
      alert("Failed uploading avatar.");
      return null;
    }
  };

  // -------------------------------------
  // Save ALL profile updates
  // -------------------------------------
  const handleSave = async () => {
    try {
      let avatarUrl = user.avatarUrl;

      // Upload image first
      if (avatarFile) {
        avatarUrl = await uploadToCloudinary();
      }

      const body = {
        username,
        email,
        password: password || null,
        avatar_url: avatarUrl || null,
      };

      // update in backend
      const res = await api.put(`/users/${user.id}`, body);

      const updatedUser = {
        ...user,
        username: res.data.username,
        email: res.data.email,
        avatarUrl: res.data.avatarUrl,
      };

      // update global user
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Could not update profile.");
    }
  };

  return (
    <div className="profile-wrapper">
      <h2>Edit Profile</h2>

      {/* Avatar section */}
      <div className="avatar-section">
        <img
          src={preview}
          alt="Avatar"
          className="avatar-preview"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setAvatarFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
      </div>

      {/* Username */}
      <div className="input-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* New password */}
      <div className="input-group">
        <label>New Password (optional)</label>
        <input
          type="password"
          placeholder="Enter new password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}