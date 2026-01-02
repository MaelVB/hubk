import Head from "next/head";
import { signIn } from "next-auth/react";
import { Center } from "@mantine/core";
import { AuthCard } from "../components/AuthCard";

export default function Login() {
  return (
    <>
      <Head>
        <title>Hubk Portal - Login</title>
        <meta name="description" content="Sign in to your application hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Center mih="100vh" p="md">
        <AuthCard
          title="Login"
          description="Use your identity provider to sign in."
          buttonLabel="Sign in"
          onSignIn={() => signIn("oidc")}
        />
      </Center>
    </>
  );
}
