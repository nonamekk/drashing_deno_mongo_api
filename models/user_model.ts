import BaseModel from "./base_model.ts";
import {Bson} from "../deps.ts";
import {config as dotEnv} from "../config.ts";


interface IUser {
    _id: {$oid: string},
    email: string,
    username: string,
    password: string,
    role: string
}

// Stop using any, you are in typescript! need fix
// Yes, I know I can use fields to pass [key:string]:string to have a where() not getBy..(), for now this is ok

export class UserModel extends BaseModel {
    /*

        to do:

        connect collection

        get by id

        get by email

        create

        update 

        delete (set items status to sell active)

    */

    private static async connection() {
        const client = await BaseModel.connect();
        return client.database(dotEnv.mongoDatabase as string).collection<IUser>("users");
    }

    public static async getById(userId: string) {
        const collection = await this.connection();
        return await collection.findOne(
            { _id: new Bson.ObjectId(userId) },
            { noCursorTimeout: false } as any,
        );
    }

    public static async getByEmail(userEmail: string): Promise<any> {
        const collection = await this.connection();
        return await collection.findOne(
            { email: userEmail },
            { noCursorTimeout: false } as any,
        );
    }

    public static async getByUsername(userUsername: string): Promise<any>  {
        const collection = await this.connection();
        return await collection.findOne(
            { username: userUsername}, 
            { noCursorTimeout: false } as any
        );
    }

    public static async create (user: any): Promise<string>  {
        const collection = await this.connection();
        return (await collection.insertOne(user)).toString();
    }

    public static async update (user: any) {
        const collection = await this.connection();
        const filter = { _id: new Bson.ObjectId(user.id) };

        // only allowed to give specifically named values. Example : update({id, updatedQuantity});
        const update = { $set: { 
            password: user.updatedPassword, 
            username: user.updatedUsername, 
            email : user.updatedEmail,
        } }; 
        
        return await collection.updateOne(filter, update);
    }

    public static async delete (userId: string) {
        const collection = await this.connection();
        return await collection.deleteOne({_id: new Bson.ObjectId(userId)});
    }

}

export default UserModel;