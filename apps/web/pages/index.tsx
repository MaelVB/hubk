import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { AppSummary } from "@hubk/shared";

export default function Home() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    const loadApps = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/apps`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setApps(data.apps ?? []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [session?.accessToken]);

  if (status === "loading") {
    return <main>Loading session...</main>;
  }

  if (!session) {
    return (
      <main>
        <h1>Hubk Portal</h1>
        <p>Please sign in to view your applications.</p>
        <button onClick={() => signIn("oidc")}>Sign in</button>
      </main>
    );
  }

  return (
    <div>
      <header className="topbar">
        <strong>Hubk</strong>
        <div>
          <span>{session.user?.name ?? session.user?.email}</span>
          <button style={{ marginLeft: 12 }} onClick={() => signOut()}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <h1>Your Apps</h1>
        {loading ? <p>Loading apps...</p> : null}
        {!loading && apps.length === 0 ? (
          <p>No applications assigned yet.</p>
        ) : (
          <div className="app-grid">
            {apps.map((app) => (
              <div className="app-card" key={app.id}>
                {app.iconUrl ? <img src={app.iconUrl} alt={app.name} /> : null}
                <div>
                  <strong>{app.name}</strong>
                  <p>{app.description}</p>
                </div>
                <button
                  onClick={() => window.open(app.targetUrl, "_blank")}
                >
                  Launch
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
