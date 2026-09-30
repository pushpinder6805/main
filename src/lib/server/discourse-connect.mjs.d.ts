export interface ConnectRequest {sso: string; sig: string}
export interface ConnectAccount {externalId: string; email: string; emailVerified: boolean; username?: string; name?: string}
export function verifyConnectRequest(payload: string, sig: string, secret: string, communityOrigin: string): {nonce: string; returnUrl: string};
export function createConnectResponse(request: ConnectRequest, account: ConnectAccount, secret: string, communityOrigin: string): string;
