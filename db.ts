import {MongoClient} from "./deps.ts";
import {Bson} from "./deps.ts";
import {config as dotEnv} from "./config.ts";




const mongoClient = new MongoClient();
await mongoClient.connect({
    db: dotEnv.mongoDatabase as string,
    tls: true,
    servers: [
        {
            host: dotEnv.mongoHost as string,
            port: 27017
        },
    ],
    credential: {
        username: dotEnv.mongoUsername as string,
        password: dotEnv.mongoPassword as string,
        db: dotEnv.mongoDatabase as string,
        mechanism: "SCRAM-SHA-1",
    },
});

export {mongoClient};