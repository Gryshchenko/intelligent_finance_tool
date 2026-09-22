import { Signer } from '@aws-sdk/rds-signer';
import { Knex } from 'knex';

export interface IPgConnectionSettings {
    host: string | undefined;
    port: number | undefined;
    database: string | undefined;
    user: string | undefined;
    password: string | undefined;
    ssl: boolean | undefined;
    iamAuth?: boolean | undefined;
    region?: string | undefined;
}

// An RDS IAM token is valid for 15 minutes. It is only checked when a connection opens,
// so pooled connections outlive it; refreshing a little early keeps new ones from racing
// the expiry.
const IAM_TOKEN_TTL_MS = 10 * 60 * 1000;

/**
 * Connection config shared by the server pool and the migration runner.
 *
 * With `iamAuth` the password is replaced by a token signed with the credentials the AWS
 * SDK finds on its own - on EC2, the instance role. The DB user must be granted `rds_iam`,
 * which also makes password logins fail for it.
 */
export function pgConnection(settings: IPgConnectionSettings): Knex.PgConnectionConfig | Knex.AsyncConnectionConfigProvider {
    const { host, port, database, user, password, ssl, iamAuth, region } = settings;

    if (!iamAuth) {
        return {
            host,
            port,
            database,
            user,
            password,
            // Certificate is always verified when TLS is on; to trust a custom/self-signed
            // CA in dev, point NODE_EXTRA_CA_CERTS at its root cert instead of disabling checks.
            ssl: ssl ? { rejectUnauthorized: true } : false,
        };
    }

    if (!ssl) {
        throw new Error('DB_IAM_AUTH=true requires DB_SSL=true: RDS rejects IAM tokens over plain connections');
    }
    if (!host || !port || !user || !region) {
        throw new Error('DB_IAM_AUTH=true requires DB_HOST, DB_PORT, DB_USER and AWS_REGION');
    }

    const signer = new Signer({ hostname: host, port, username: user, region });

    return async () => {
        const expiresAt = Date.now() + IAM_TOKEN_TTL_MS;
        return {
            host,
            port,
            database,
            user,
            password: await signer.getAuthToken(),
            ssl: { rejectUnauthorized: true },
            expirationChecker: () => Date.now() >= expiresAt,
        };
    };
}
