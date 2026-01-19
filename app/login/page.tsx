"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapAuthError(message: string) {
    const msg = message.toLowerCase();

    if (msg.includes("missing email or phone"))
      return "Please enter your email address.";
    if (msg.includes("invalid login credentials"))
      return "Invalid email or password.";
    if (msg.includes("email not confirmed"))
      return "Please confirm your email address.";
    if (msg.includes("user already registered"))
      return "This account already exists. Please sign in.";
    if (msg.includes("password should be at least"))
      return "Password must be at least 6 characters long.";

    return "Authentication failed. Please try again.";
  }

  function validate() {
    const e = email.trim();
    const p = password;

    if (!e) return "Email is required.";
    if (!e.includes("@")) return "Invalid email format.";
    if (!p) return "Password is required.";
    if (p.length < 6) return "Password must be at least 6 characters long.";

    return null;
  }

  async function signIn() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(mapAuthError(error.message));
      return;
    }

    router.push("/components");
  }

  async function signUp() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(mapAuthError(error.message));
      return;
    }

    alert("Account created successfully. You can now sign in.");
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">
          Use your email and password to access the application.
        </p>

        <div className="login-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>
          )}

          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={signIn}
              disabled={loading}
            >
              Sign in
            </button>

            <button className="btn" onClick={signUp} disabled={loading}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
