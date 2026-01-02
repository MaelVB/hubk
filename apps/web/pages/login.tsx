import Head from "next/head";
import { signIn } from "next-auth/react";
import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";

export default function Login() {
  return (
    <>
      <Head>
        <title>Hubk Portal - Login</title>
        <meta name="description" content="Sign in to your application hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Center mih="100vh" p="md">
        <Paper radius="md" shadow="md" withBorder p="xl">
          <Stack gap="md" align="center">
            <Title order={3}>Login</Title>
            <Text size="sm" c="dimmed" ta="center">
              Use your identity provider to sign in.
            </Text>
            <Button onClick={() => signIn("oidc")} aria-label="Sign in with your identity provider">
              Sign in
            </Button>
          </Stack>
        </Paper>
      </Center>
    </>
  );
}
