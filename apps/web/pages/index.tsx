import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  ActionIcon,
  Alert,
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconMoon,
  IconSearch,
  IconSettings,
  IconSun
} from "@tabler/icons-react";
import type { AppSummary } from "@hubk/shared";

type RuntimeEnv = {
  NEXT_PUBLIC_API_BASE_URL?: string;
  NEXT_PUBLIC_APPS_MODE?: string;
};

const getRuntimeEnv = (): RuntimeEnv | undefined => {
  if (typeof window !== "undefined") {
    const runtimeEnv = (window as typeof window & { __ENV?: RuntimeEnv }).__ENV;
    return runtimeEnv;
  }
  return undefined;
};

const getApiBaseUrl = () => {
  const runtimeEnv = getRuntimeEnv();
  return runtimeEnv?.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
};

const getAppsMode = () => {
  const runtimeEnv = getRuntimeEnv();
  return runtimeEnv?.NEXT_PUBLIC_APPS_MODE ?? process.env.NEXT_PUBLIC_APPS_MODE;
};

// Allow optional availability flag without coupling to shared types.
const isAppAvailable = (app: AppSummary) => {
  const availability = (app as AppSummary & { isAvailable?: boolean }).isAvailable;
  return availability ?? true;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [settingsApp, setSettingsApp] = useState<AppSummary | null>(null);
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true
  });
  const isDark = computedColorScheme === "dark";
  const appsMode = (getAppsMode() ?? "hybrid").toLowerCase();
  const isHybridMode = appsMode === "hybrid";

  const filteredApps = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return apps;
    }

    return apps.filter((app) => {
      const displayName = app.name ?? app.slug;
      const fields = [displayName, app.slug, app.description, app.notes]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase());
      return fields.some((value) => value.includes(trimmedQuery));
    });
  }, [apps, query]);

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    const loadApps = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = getApiBaseUrl();
        if (!apiBaseUrl) {
          setError("Missing API base URL configuration");
          setLoading(false);
          return;
        }

        console.log("Fetching apps with token:", session.accessToken?.substring(0, 20) + "...");
        const response = await fetch(`${apiBaseUrl}/apps`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        console.log("API Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Apps loaded:", data);
          setApps(data.apps ?? []);
        } else {
          const errorText = await response.text();
          setError(`Failed to load applications: ${response.status} ${response.statusText}`);
          console.error("API Error:", errorText);
        }
      } catch (err) {
        setError("Network error: Unable to reach the API server");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [session?.accessToken]);

  const handleCloseSettings = () => {
    closeSettings();
    setSettingsApp(null);
  };

  const openAppTarget = (targetUrl: string) => {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
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
        <Center mih="100vh" p="md">
          <Paper radius="md" shadow="md" withBorder p="xl">
            <Stack gap="md" align="center">
              <Title order={3}>Hubk Portal</Title>
              <Text size="sm" c="dimmed" ta="center">
                Please sign in to view your applications.
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

  const userLabel = session.user?.name ?? session.user?.email ?? "User";
  const settingsTitle = settingsApp
    ? `Settings - ${settingsApp.name ?? settingsApp.slug}`
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
            Settings are available only in hybrid mode.
          </Text>
          <Button variant="light" onClick={handleCloseSettings}>
            Close
          </Button>
        </Stack>
      </Modal>
      <AppShell header={{ height: 72 }} padding="md">
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Flex align="center" justify="space-between" h="100%" gap="md" wrap="wrap">
              <Group gap="sm">
                <Title order={1}>Hubk</Title>
              </Group>
              <Box
                style={{
                  flex: 1,
                  minWidth: 220,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <TextInput
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search apps"
                  leftSection={<IconSearch size={16} />}
                  w="100%"
                  maw={420}
                  aria-label="Search applications"
                />
              </Box>
              <Group gap="sm">
                <Text size="sm" c="dimmed">
                  {userLabel}
                </Text>
                <Tooltip label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
                  <ActionIcon
                    variant="light"
                    onClick={() => setColorScheme(isDark ? "light" : "dark")}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
                  </ActionIcon>
                </Tooltip>
                <Button variant="light" size="xs" onClick={() => signOut()}>
                  Logout
                </Button>
              </Group>
            </Flex>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="lg">
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <Title order={2}>Your Apps</Title>
                <Badge variant="light" color="gray">
                  {filteredApps.length} apps
                </Badge>
              </Group>
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
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => window.location.reload()}
                      >
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
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                  {filteredApps.map((app) => {
                    const displayName = app.name ?? app.slug;
                    const available = isAppAvailable(app);
                    const availabilityColor = available
                      ? theme.colors.green[6]
                      : theme.colors.red[6];
                    const initials = displayName
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const handleOpen = () => {
                      if (!available) {
                        return;
                      }
                      openAppTarget(app.targetUrl);
                    };

                    return (
                      <Paper
                        key={app.id}
                        withBorder
                        radius="md"
                        shadow="sm"
                        p="md"
                        role="button"
                        tabIndex={available ? 0 : -1}
                        aria-label={available ? `Open ${displayName}` : `${displayName} unavailable`}
                        aria-disabled={!available}
                        onClick={handleOpen}
                        onKeyDown={(event) => {
                          if (!available) {
                            return;
                          }
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleOpen();
                          }
                        }}
                        style={{
                          aspectRatio: "1 / 1",
                          borderLeftWidth: 6,
                          borderLeftStyle: "solid",
                          borderLeftColor: availabilityColor,
                          cursor: available ? "pointer" : "not-allowed"
                        }}
                      >
                        <Stack h="100%" gap="xs">
                          <Box pos="relative">
                            {isHybridMode && (
                              <ActionIcon
                                variant="subtle"
                                size="sm"
                                style={{ position: "absolute", top: 0, right: 0 }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSettingsApp(app);
                                  openSettings();
                                }}
                                aria-label={`Open settings for ${displayName}`}
                              >
                                <IconSettings size={16} />
                              </ActionIcon>
                            )}
                            <Title order={5} ta="center">
                              {displayName}
                            </Title>
                          </Box>
                          <Center>
                            <Avatar src={app.iconUrl ?? undefined} radius="md" size={56} color="blue">
                              {initials}
                            </Avatar>
                          </Center>
                          <Stack gap={4} style={{ flex: 1 }}>
                            {app.description && (
                              <Text size="sm" c="dimmed" lineClamp={2}>
                                {app.description}
                              </Text>
                            )}
                            {app.notes && (
                              <Text size="xs" c="dimmed" lineClamp={2}>
                                {app.notes}
                              </Text>
                            )}
                          </Stack>
                          <Group justify="space-between">
                            <Badge color={available ? "green" : "red"} variant="light">
                              {available ? "Available" : "Unavailable"}
                            </Badge>
                            <Button
                              size="xs"
                              variant="light"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpen();
                              }}
                              disabled={!available}
                              aria-label={`Open ${displayName}`}
                            >
                              Open
                            </Button>
                          </Group>
                        </Stack>
                      </Paper>
                    );
                  })}
                </SimpleGrid>
              )}
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
