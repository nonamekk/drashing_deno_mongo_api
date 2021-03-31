import { config as dotEnv } from "./deps.ts"
import { AES } from "./deps.ts";


// Remove in production
const envPath: string = '.env'.toString();
const envConfig = dotEnv({
    path: envPath,
})
// In production pass the .env before deno run, spacing .env vars
// Uncomment below and comment whats upper
//const envConfig = dotEnv();

const config: ({
    mongoUsername: string;
    mongoPassword: string;
    mongoDatabase: string;
    mongoHost: string;
    cipherKey: string;
    cipherInitVector: string;
    jwtKey: string
}) = {
    mongoUsername: envConfig.MONGOUSERNAME,
    mongoPassword: envConfig.MONGOPASSWORD,
    mongoDatabase: envConfig.MONGODATABASE,
    mongoHost: envConfig.MONGOHOST,
    cipherKey: envConfig.CIPHERKEY,
    cipherInitVector: envConfig.CIPHERIV,
    jwtKey: envConfig.JWTSUPERKEY,
}

const aes = new AES(config.cipherKey, {
    mode: "cbc" ,
    iv: config.cipherInitVector as string,
});

export { config, aes };