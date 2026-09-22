import { getConfig } from 'src/config/config';

const config = {
    database: getConfig().dbName,
    port: Number(getConfig().dbPort),
    password: getConfig().dbPass,
    user: getConfig().dbUser,
    host: getConfig().dbHost,
    ssl: getConfig().dbSsl,
    iamAuth: getConfig().dbIamAuth,
    region: getConfig().awsRegion,
    // cert: getConfig().dbCACert,
};
export default config;
