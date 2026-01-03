import { useMemo, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Alert,
  AppShell,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Paper,
  Flex,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { AppSummary } from "@hubk/shared";
import { AppCard } from "../components/AppCard";
import { AppsHeader } from "../components/AppsHeader";
import { AuthCard } from "../components/AuthCard";
import { useApps } from "../hooks/use-apps";
import { useAppsMode } from "../hooks/use-apps-mode";
import { filterApps, getAppDisplayName } from "../lib/apps";

export default function Home() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState("");
  const [settingsApp, setSettingsApp] = useState<AppSummary | null>(null);
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { apps, loading, error, reload } = useApps(session?.accessToken);
  const { mode: appsMode } = useAppsMode(session?.accessToken);
  const filteredApps = useMemo(() => filterApps(apps, query), [apps, query]);
  const isHybridMode = appsMode === "hybrid";

  const handleCloseSettings = () => {
    closeSettings();
    setSettingsApp(null);
  };

  const handleOpenApp = (app: AppSummary) => {
    window.open(app.targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenSettings = (app: AppSummary) => {
    if (!isHybridMode) {
      return;
    }
    setSettingsApp(app);
    openSettings();
  };

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Hubk Portal - Loading</title>
          <meta name="description" content="Application hub for your Kubernetes cluster" />
        </Head>
        <Center mih="100vh" p="md">
          <Stack align="center" gap="xs">
            <Loader />
            <Text size="sm" c="dimmed">
              Loading session...
            </Text>
          </Stack>
        </Center>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Head>
          <title>Hubk Portal - Sign In</title>
          <meta name="description" content="Sign in to access your applications" />
        </Head>
        <Center mih="80vh" p="md">
          <AuthCard
            title="Hubk"
            description="Please sign in to view your applications."
            buttonLabel="Sign in"
            onSignIn={() => signIn("oidc")}
          />
        </Center>
      </>
    );
  }

  const userLabel = session.user?.name ?? session.user?.email ?? "User";
  const settingsTitle = settingsApp
    ? `Settings - ${getAppDisplayName(settingsApp)}`
    : "Settings";

  return (
    <>
      <Head>
        <title>Hubk Portal - Your Applications</title>
        <meta name="description" content="Access all your applications from one place" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Modal opened={settingsOpened} onClose={handleCloseSettings} title={settingsTitle} centered>
        <Stack gap="sm">
          <Text size="sm" c="dimmed">
            Manage application settings here.
          </Text>
          <Button variant="light" onClick={handleCloseSettings}>
            Close
          </Button>
        </Stack>
      </Modal>
      <AppShell header={{ height: 72 }} padding="md">
        <AppsHeader
          query={query}
          onQueryChange={setQuery}
          userLabel={userLabel}
          onSignOut={() => signOut()}
          appsCount={filteredApps.length}
        />
        <AppShell.Main>
          <Container size="lg" mt="xs">
            <Stack gap="lg">
              {error && (
                <Alert
                  icon={<IconAlertTriangle size={16} />}
                  color="red"
                  variant="light"
                  title="Unable to load applications"
                >
                  <Stack gap="sm">
                    <Text size="sm">{error}</Text>
                    <Group>
                      <Button size="xs" variant="light" onClick={reload}>
                        Retry
                      </Button>
                    </Group>
                  </Stack>
                </Alert>
              )}
              {loading && (
                <Center py="xl">
                  <Stack align="center" gap="xs">
                    <Loader />
                    <Text size="sm" c="dimmed">
                      Loading apps...
                    </Text>
                  </Stack>
                </Center>
              )}
              {!loading && !error && filteredApps.length === 0 && (
                <Paper withBorder radius="md" p="lg">
                  <Text size="sm" c="dimmed">
                    {query.trim()
                      ? "No applications match your search."
                      : "No applications assigned yet."}
                  </Text>
                </Paper>
              )}
              {!loading && !error && filteredApps.length > 0 && (
                <Flex
                  gap="lg"
                  justify="center"
                  align="flex-start"
                  direction="row"
                  wrap="wrap"
                >
                  {filteredApps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      showSettings={isHybridMode}
                      onOpen={handleOpenApp}
                      onOpenSettings={handleOpenSettings}
                    />
                  ))}
                </Flex>
              )}
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
