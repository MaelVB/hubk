import Head from "next/head";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <>
      <Head>
        <title>Hubk Portal - Login</title>
        <meta name="description" content="Sign in to your application hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Login</h1>
        <p>Use your identity provider to sign in.</p>
        <button 
          onClick={() => signIn("oidc")}
          aria-label="Sign in with your identity provider"
        >
          Sign in
        </button>
      </main>
    </>
  );
}
