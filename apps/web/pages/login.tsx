import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <p>Use your identity provider to sign in.</p>
      <button onClick={() => signIn("oidc")}>Sign in</button>
    </main>
  );
}
