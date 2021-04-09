import {Bson} from "../deps.ts";
import {config as dotEnv} from "../config.ts";
import {mongoClient} from "../db.ts";


interface IUser {
    _id: {$oid: string};
    email: string;
    username: string;
    password: string;
    ecash: number;
    role: string;
}

const users = mongoClient.database(dotEnv.mongoDatabase as string).collection<IUser>("users");

export class UserModel {

    public static async getById(userId: string) {
        return await users.findOne(
            { _id: new Bson.ObjectId(userId) },
            { noCursorTimeout: false } as any,
        );
    }

    public static async getByEmail(userEmail: string): Promise<any> {
        return await users.findOne(
            { email: userEmail },
            { noCursorTimeout: false } as any,
        );
    }

    public static async getByUsername(userUsername: string): Promise<any>  {
        return await users.findOne(
            { username: userUsername}, 
            { noCursorTimeout: false } as any
        );
    }

    public static async create (user: any): Promise<string>  {
        return (await users.insertOne(user)).toString();
    }

    public static async update (user: any) {
        const inType = (typeof(user.id)).toString();
        var filter;
        if (inType == "string") {
            filter = { _id: new Bson.ObjectId(user.id) };
        }
        else {
            filter = { _id: user.id };
        }

        // only allowed to give specifically named values. Example : update({id, updatedQuantity});
        const update = { $set: { 
            password: user.updatedPassword, 
            username: user.updatedUsername, 
            email : user.updatedEmail,
            ecash: user.updatedEcash,
        } }; 
        
        return await users.updateOne(filter, update);
    }

    public static async delete (userId: string) {
        return await users.deleteOne({_id: new Bson.ObjectId(userId)});
    }
}

export default UserModel;