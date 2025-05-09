"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Role } from "@/prisma-client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegular, setIsRegular] = useState(false);
  const [role, setRole] = useState<Role>(Role.RegularUser); // Default to RegularUser role

  const signupMutation = api.auth.signup.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signupMutation.mutateAsync({ email, password, name, isRegular, role });
      console.log("Signup successful", result);
      // Optionally, redirect the user to the login page or automatically log them in
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      maxWidth: "400px",
      margin: "10em auto",
      padding: "1rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
      Name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: "0.5rem",
        }}
      />
      </label>
      <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
      Email:
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: "0.5rem",
        }}
      />
      </label>
      <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
      Password:
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: "0.5rem",
        }}
      />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
      Regular User:
      <input
        type="checkbox"
        checked={isRegular}
        onChange={(e) => setIsRegular(e.target.checked)}
        style={{ transform: "scale(1.2)" }}
      />
      </label>
      <label style={{ display: "flex", flexDirection: "column", fontWeight: "bold" }}>
      Role:
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        required
        style={{
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: "0.5rem",
        }}
      >
        {Object.values(Role).map((role) => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
        ))}
      </select>
      </label>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      <button
      type="submit"
      style={{
        padding: "0.75rem",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007BFF",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
      >
      Sign Up
      </button>
    </form>
  );
}
