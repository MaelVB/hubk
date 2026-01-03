import { Button, Paper, Stack, Text, Title } from "@mantine/core";

type AuthCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onSignIn: () => void;
};

export const AuthCard = ({ title, description, buttonLabel, onSignIn }: AuthCardProps) => (
  <Paper radius="md" shadow="md" withBorder p="xl">
    <Stack gap="md" align="center">
      <Title order={1}>{title}</Title>
      <Text ta="center">
        {description}
      </Text>
      <Button onClick={onSignIn} aria-label={buttonLabel}>
        {buttonLabel}
      </Button>
    </Stack>
  </Paper>
);
