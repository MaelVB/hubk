import type { IdpAdapter } from "@hubk/auth-core";
export type AuthentikAdapterConfig = {
    issuer: string;
    jwksUrl?: string;
    apiUrl?: string;
    apiToken?: string;
};
export declare function createAuthentikAdapter(config: AuthentikAdapterConfig): IdpAdapter;
//# sourceMappingURL=index.d.ts.map