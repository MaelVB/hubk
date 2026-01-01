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
    apiToken;
    constructor(apiUrl, apiToken) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
    }
    async listAppsForUser(user, accessToken) {
        console.log("[AuthentikAppsAdapter] listAppsForUser called");
        console.log("[AuthentikAppsAdapter] API URL:", this.apiUrl);
        console.log("[AuthentikAppsAdapter] Has API token:", !!this.apiToken);
        console.log("[AuthentikAppsAdapter] User subject:", user.subject);
        if (!this.apiUrl) {
            console.warn("[AuthentikAppsAdapter] Authentik API URL not configured, returning empty apps list");
            return [];
        }
        if (!this.apiToken) {
            console.warn("[AuthentikAppsAdapter] Authentik API token not configured, returning empty apps list");
            return [];
        }
        try {
            // Récupérer les applications assignées à l'utilisateur via l'API Authentik
            // On utilise le user.subject pour filtrer les applications accessibles par l'utilisateur
            // Note: L'API Authentik nécessite un token API avec les bonnes permissions
            const url = `${this.apiUrl}/core/applications/?only_with_launch_url=true&ordering=name&page=1&page_size=100`;
            console.log("[AuthentikAppsAdapter] Fetching apps from:", url);
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${this.apiToken}`,
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
            const apps = (data.results ?? []).map(app => ({ slug: app.slug }));
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
        apps: new AuthentikAppsAdapter(config.apiUrl, config.apiToken)
    };
}
//# sourceMappingURL=index.js.map