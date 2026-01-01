import { useEffect, useState, type CSSProperties } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import type { AppSummary } from "@hubk/shared";

type RuntimeEnv = {
  NEXT_PUBLIC_API_BASE_URL?: string;
};

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const runtimeEnv = (window as typeof window & { __ENV?: RuntimeEnv }).__ENV;
    if (runtimeEnv?.NEXT_PUBLIC_API_BASE_URL) {
      return runtimeEnv.NEXT_PUBLIC_API_BASE_URL;
    }
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const response = await fetch(
          `${apiBaseUrl}/apps`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );
        console.log("API Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Apps loaded:", data);
          setApps(data.apps ?? []);
        } else {
          const errorText = await response.text();
          setError(
            `Failed to load applications: ${response.status} ${response.statusText}`
          );
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

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Hubk Portal - Loading</title>
          <meta name="description" content="Application hub for your Kubernetes cluster" />
        </Head>
        <main>Loading session...</main>
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
        <main>
          <h1>Hubk Portal</h1>
          <p>Please sign in to view your applications.</p>
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

  return (
    <>
      <Head>
        <title>Hubk Portal - Your Applications</title>
        <meta name="description" content="Access all your applications from one place" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <header className="topbar">
          <strong>Hubk</strong>
          <div>
            <span aria-label="Current user">{session.user?.name ?? session.user?.email}</span>
            <button 
              style={{ marginLeft: 12 }} 
              onClick={() => signOut()}
              aria-label="Sign out of your account"
            >
              Logout
            </button>
          </div>
        </header>
        <main>
          <h1>Your Apps</h1>
          {error && (
            <div className="error-message" role="alert">
              <p>⚠️ {error}</p>
              <button 
                onClick={() => window.location.reload()}
                aria-label="Retry loading applications"
              >
                Retry
              </button>
            </div>
          )}
          {loading && <p>Loading apps...</p>}
          {!loading && !error && apps.length === 0 && (
            <p>No applications assigned yet.</p>
          )}
          {!loading && !error && apps.length > 0 && (
            <div className="app-grid" role="list">
              {apps.map((app) => {
                const displayName = app.name ?? app.slug;
                const cardStyle = app.widgetColor
                  ? ({ "--app-accent": app.widgetColor } as CSSProperties)
                  : undefined;

                return (
                  <div className="app-card" key={app.id} role="listitem" style={cardStyle}>
                    <div className="app-icon">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={`${displayName} logo`} />
                      ) : (
                        <div
                          className="app-icon-placeholder"
                          aria-label={`${displayName} icon placeholder`}
                        >
                          {displayName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <strong>{displayName}</strong>
                      {app.description && <p>{app.description}</p>}
                      {app.notes && <p className="app-notes">{app.notes}</p>}
                    </div>
                    <button
                      onClick={() => window.open(app.targetUrl, "_blank")}
                      aria-label={`Launch ${displayName} application`}
                    >
                      Launch
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
