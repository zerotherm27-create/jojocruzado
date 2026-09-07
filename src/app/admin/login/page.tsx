"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <div className={styles.authWrap}>
      <form action={formAction} className={styles.authCard}>
        <h1 className={styles.title}>Jojo Cruzado — Admin</h1>
        <label className={styles.label}>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className={styles.input}
          />
        </label>
        {state.error && (
          <span role="alert" className={styles.error}>
            {state.error}
          </span>
        )}
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
