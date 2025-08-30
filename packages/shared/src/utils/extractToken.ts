export function extractToken(authorization: string | undefined): string | undefined {
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return undefined;
}
