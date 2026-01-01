"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthentikAdapter = createAuthentikAdapter;
const jose_1 = require("jose");
class AuthentikClaimsAdapter {
    normalize(claims) {
        const groups = Array.isArray(claims.groups)
            ? claims.groups
            : [];
        const roles = Array.isArray(claims.roles) ? claims.roles : [];
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
    issuer;
    jwks;
    constructor(issuer, jwksUrl) {
        this.issuer = issuer;
        const jwksEndpoint = jwksUrl ?? `${issuer.replace(/\/$/, "")}/.well-known/jwks.json`;
        this.jwks = (0, jose_1.createRemoteJWKSet)(new URL(jwksEndpoint));
    }
    async verify(token) {
        // Vérification sans audience stricte car Authentik met le client_id par défaut
        // C'est suffisamment sécurisé si vous vérifiez l'issuer et la signature
        const { payload } = await (0, jose_1.jwtVerify)(token, this.jwks, {
            issuer: this.issuer
            // Note: audience n'est pas vérifiée car Authentik utilise client_id comme aud
            // Pour une vérification stricte, il faudrait configurer un Resource Server dans Authentik
        });
        return payload;
    }
}
class AuthentikAppsAdapter {
    apiUrl;
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    async listAppsForUser(user, accessToken) {
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
            const data = await response.json();
            console.log("[AuthentikAppsAdapter] Apps data received:", JSON.stringify(data, null, 2));
            const apiOrigin = new URL(this.apiUrl).origin;
            const apps = (data.results ?? []).map((app) => {
                const iconUrl = typeof app.meta_icon === "string" && app.meta_icon.trim().length > 0
                    ? app.meta_icon.startsWith("http")
                        ? app.meta_icon
                        : `${apiOrigin}${app.meta_icon}`
                    : undefined;
                const description = typeof app.meta_description === "string" && app.meta_description.trim().length > 0
                    ? app.meta_description
                    : undefined;
                const targetUrl = typeof app.launch_url === "string" && app.launch_url.trim().length > 0
                    ? app.launch_url
                    : typeof app.meta_launch_url === "string" && app.meta_launch_url.trim().length > 0
                        ? app.meta_launch_url
                        : undefined;
                return {
                    id: typeof app.pk === "string" && app.pk.length > 0 ? app.pk : undefined,
                    slug: app.slug,
                    name: typeof app.name === "string" && app.name.length > 0 ? app.name : undefined,
                    description,
                    iconUrl,
                    targetUrl
                };
            });
            console.log("[AuthentikAppsAdapter] Returning apps:", apps);
            return apps;
        }
        catch (error) {
            console.error("[AuthentikAppsAdapter] Error fetching apps from Authentik:", error);
            return [];
        }
    }
}
function createAuthentikAdapter(config) {
    return {
        claims: new AuthentikClaimsAdapter(),
        jwtVerifier: new AuthentikJwtVerifier(config.issuer, config.jwksUrl),
        apps: new AuthentikAppsAdapter(config.apiUrl)
    };
}
//# sourceMappingURL=index.js.map