import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton
} from "@mantine/core";
import { IconExternalLink, IconSettings } from "@tabler/icons-react";
import type { AppSummary } from "@hubk/shared";
import { getAppDisplayName, getAppInitials } from "../lib/apps";

type AppCardProps = {
  app: AppSummary;
  showSettings: boolean;
  onOpen: (app: AppSummary) => void;
  onOpenSettings: (app: AppSummary) => void;
};

export const AppCard = ({ app, showSettings, onOpen, onOpenSettings }: AppCardProps) => {
  const displayName = getAppDisplayName(app);

  const handleOpen = () => {
    onOpen(app);
  };

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      w={256}
      h={256}
    >
      <Stack h="100%" gap="xs">
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%"
          }}
        >
          {showSettings ? (
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onOpenSettings(app);
              }}
              aria-label={`Open settings for ${displayName}`}
            >
              <IconSettings size={20} />
            </ActionIcon>
          ) : (
            <Box w={28} h={28} />
          )}
          <Title order={5} ta="center" style={{ flex: 1 }}>
            {displayName}
          </Title>
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
            aria-label={`Open ${displayName} in a new tab`}
          >
            <IconExternalLink size={20} />
          </ActionIcon>
        </Box>
        <Box
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <UnstyledButton
            onClick={handleOpen}
            aria-label={`Open ${displayName}`}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Avatar src={app.iconUrl ?? undefined} radius="md" size={56} color="blue">
              {getAppInitials(displayName)}
            </Avatar>
          </UnstyledButton>
        </Box>
        <Stack gap={4}>
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
      </Stack>
    </Paper>
  );
};
