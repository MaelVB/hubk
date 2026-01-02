type RuntimeEnv = {
  NEXT_PUBLIC_API_BASE_URL?: string;
};

const getRuntimeEnv = (): RuntimeEnv | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return (window as typeof window & { __ENV?: RuntimeEnv }).__ENV;
};

export const getApiBaseUrl = (): string | undefined => {
  const runtimeEnv = getRuntimeEnv();
  return runtimeEnv?.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
};
