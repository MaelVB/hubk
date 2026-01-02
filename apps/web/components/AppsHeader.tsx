import {
  ActionIcon,
  AppShell,
  Badge,
  Box,
  Container,
  Flex,
  Group,
  Text,
  TextInput,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core";
import { IconLogout, IconMoon, IconSearch, IconSun } from "@tabler/icons-react";

type AppsHeaderProps = {
  appsCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  userLabel: string;
  onSignOut: () => void;
};

export const AppsHeader = ({
  appsCount,
  query,
  onQueryChange,
  userLabel,
  onSignOut
}: AppsHeaderProps) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true
  });
  const isDark = computedColorScheme === "dark";

  return (
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
            <Group gap="xs" wrap="nowrap" style={{ width: "100%", maxWidth: 520 }}>
              <TextInput
                value={query}
                onChange={(event) => onQueryChange(event.currentTarget.value)}
                placeholder="Search apps"
                leftSection={<IconSearch size={16} />}
                maw={420}
                aria-label="Search applications"
                style={{ flex: 1 }}
              />
              <Badge variant="light" color="gray">
                {appsCount} apps
              </Badge>
            </Group>
          </Box>
          <Group gap="sm">
            <Text>
              {userLabel}
            </Text>
            <Tooltip label="Logout">
              <ActionIcon variant="light" onClick={onSignOut} aria-label="Logout">
                <IconLogout size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              <ActionIcon
                variant="light"
                onClick={() => setColorScheme(isDark ? "light" : "dark")}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <IconSun /> : <IconMoon />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Flex>
      </Container>
    </AppShell.Header>
  );
};
