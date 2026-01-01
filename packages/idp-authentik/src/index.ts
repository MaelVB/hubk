import type {
  IdpAdapter,
  IdpAppsPort,
  IdpClaimsPort,
  RawIdpClaims
} from "@hubk/auth-core";
import type { NormalizedUserClaims } from "@hubk/shared";
import { createRemoteJWKSet, jwtVerify } from "jose";

export type AuthentikAdapterConfig = {
  issuer: string;
  jwksUrl?: string;
  apiUrl?: string;      // URL de l'API Authentik (ex: https://authentik.example.com/api/v3)
};

class AuthentikClaimsAdapter implements IdpClaimsPort {
  normalize(claims: RawIdpClaims): NormalizedUserClaims {
    const groups = Array.isArray(claims.groups)
      ? (claims.groups as string[])
      : [];
    const roles = Array.isArray(claims.roles) ? (claims.roles as string[]) : [];

    return {
      subject: String(claims.sub ?? ""),
      email: typeof claims.email === "string" ? claims.email : undefined,
      displayName: typeof claims.name === "string" ? claims.name : undefined,
      groups,
      roles
    };
  }
}

class AuthentikJwtVerifier {
  private readonly jwks;

  constructor(
    private readonly issuer: string,
    jwksUrl?: string
  ) {
    const jwksEndpoint = jwksUrl ?? `${issuer.replace(/\/$/, "")}/.well-known/jwks.json`;
    this.jwks = createRemoteJWKSet(new URL(jwksEndpoint));
  }

  async verify(token: string): Promise<RawIdpClaims> {
    // Vérification sans audience stricte car Authentik met le client_id par défaut
    // C'est suffisamment sécurisé si vous vérifiez l'issuer et la signature
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.issuer
      // Note: audience n'est pas vérifiée car Authentik utilise client_id comme aud
      // Pour une vérification stricte, il faudrait configurer un Resource Server dans Authentik
    });
    return payload as RawIdpClaims;
  }
}

class AuthentikAppsAdapter implements IdpAppsPort {
  constructor(private readonly apiUrl?: string) {}

  async listAppsForUser(user: NormalizedUserClaims, accessToken?: string): Promise<{ slug: string }[]> {
    console.log("[AuthentikAppsAdapter] listAppsForUser called");
    console.log("[AuthentikAppsAdapter] API URL:", this.apiUrl);
    console.log("[AuthentikAppsAdapter] Has access token:", !!accessToken);
    console.log("[AuthentikAppsAdapter] User subject:", user.subject);
    
    if (!this.apiUrl) {
      console.warn("[AuthentikAppsAdapter] Authentik API URL not configured, returning empty apps list");
      return [];
    }

    if (!accessToken) {
      console.warn("[AuthentikAppsAdapter] No access token provided, returning empty apps list");
      return [];
    }

    try {
      // Récupérer les applications assignées à l'utilisateur via l'API Authentik
      // L'endpoint /me retourne uniquement les apps de l'utilisateur authentifié
      const url = `${this.apiUrl}/core/applications/?only_with_launch_url=true&ordering=name&page=1&page_size=100`;
      console.log("[AuthentikAppsAdapter] Fetching apps from:", url);
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      console.log("[AuthentikAppsAdapter] Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AuthentikAppsAdapter] Failed to fetch apps from Authentik: ${response.status} ${response.statusText}`);
        console.error(`[AuthentikAppsAdapter] Error body:`, errorText);
        return [];
      }

      const data = await response.json() as { 
        results?: Array<{ slug: string; name: string; launch_url?: string }> 
      };
      
      console.log("[AuthentikAppsAdapter] Apps data received:", JSON.stringify(data, null, 2));
      
      const apps = (data.results ?? []).map(app => ({ slug: app.slug }));
      console.log("[AuthentikAppsAdapter] Returning apps:", apps);
      
      return apps;
    } catch (error) {
      console.error("[AuthentikAppsAdapter] Error fetching apps from Authentik:", error);
      return [];
    }
  }
}

export function createAuthentikAdapter(config: AuthentikAdapterConfig): IdpAdapter {
  return {
    claims: new AuthentikClaimsAdapter(),
    jwtVerifier: new AuthentikJwtVerifier(
      config.issuer,
      config.jwksUrl
    ),
    apps: new AuthentikAppsAdapter(config.apiUrl)
  };
}
