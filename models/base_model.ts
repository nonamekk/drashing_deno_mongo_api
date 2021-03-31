import {MongoClient} from "../deps.ts";
import {Bson} from "../deps.ts";
import {config as dotEnv} from "../config.ts";

const client = new MongoClient();


export default abstract class BaseModel {

    /* Mongo v0.13.0
    // Doesn't support toArray()??
    static async connect(): Promise<MongoClient> 
    {
        await client.connectWithUri(
            "mongodb+srv//" + dotEnv.mongoUsername as string +
            ":" + dotEnv.mongoPassword + 
            "@" + dotEnv.mongoCluster + "/"
        );
        return client;
    }

    */
    // Mongo above v
    static async connect(): Promise<MongoClient>
    {
        await client.connect({
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
        return client;
    }
}