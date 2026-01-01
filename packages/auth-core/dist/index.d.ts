import type { NormalizedUserClaims } from "@hubk/shared";
export type RawIdpClaims = Record<string, unknown>;
export interface IdpClaimsPort {
    normalize(claims: RawIdpClaims): NormalizedUserClaims;
}
export type IdpAppAccess = {
    slug: string;
    id?: string;
    name?: string;
    description?: string;
    iconUrl?: string;
    targetUrl?: string;
    notes?: string;
    widgetColor?: string;
    sortOrder?: number;
    isVisible?: boolean;
};
export interface IdpAppsPort {
    listAppsForUser(user: NormalizedUserClaims, accessToken?: string): Promise<IdpAppAccess[]>;
}
export interface JwtVerifierPort {
    verify(token: string): Promise<RawIdpClaims>;
}
export type IdpAdapter = {
    claims: IdpClaimsPort;
    jwtVerifier: JwtVerifierPort;
    apps: IdpAppsPort;
};
//# sourceMappingURL=index.d.ts.map