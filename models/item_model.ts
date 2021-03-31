import BaseModel from "./base_model.ts";
import {Bson} from "../deps.ts";
import {config as dotEnv} from "../config.ts";

interface IItem {
    _id: {$oid: string};
    name: string;
    price: number;
    onSale: boolean;
    owner: string;
}

export class ItemModel extends BaseModel {
    /*
        to do:

        create

        getAll 
        [ getAllInShop, getAllInInventory ] by option [status, ownerid]

        Update 
        [ updateStatus, updateOwner, updatePrice ]

        delete

    */

    public static async connection() {
        const client = await BaseModel.connect();
        return client.database(dotEnv.mongoDatabase as string).collection<IItem>("items");
    }

    public static async getById(itemId: string) {
        const collection = await this.connection();
        const itemData = await collection.findOne(
            { _id: new Bson.ObjectId(itemId) },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async getByName(itemName: string) {
        const collection = await this.connection();
        const itemData = await collection.findOne(
            { name: itemName },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async getByNameOnSale(itemName: string) {
        const collection = await this.connection();
        const itemData = await collection.findOne(
            { name: itemName, onSale: true },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async create(item: any) {
        const collection = await this.connection();
        return (await collection.insertOne(item)).toString();
    }

    public static async getAllInShop (skip: number, limit: number) {
        const collection = await this.connection();
        return await collection.find(
            { onSale: true}, 
            { noCursorTimeout: false } as any )
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    public static async getAll (skip: number, limit: number) {
        const collection = await this.connection();
        return await collection.find({}, { noCursorTimeout: false } as any).skip(skip)
            .limit(limit).toArray();
    }


    public static async update (item: any) {
        const collection = await this.connection();
        const inType = (typeof(item.id)).toString();
        var filter;
        if (inType == "string") {
            filter = { _id: new Bson.ObjectId(item.id) };
        }
        else {
            filter = { _id: item.id };
        }

        // verification can be added :) but not here... not now...
        //if (item.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
        

        // only allowed to give specifically named values. Example : update({id, updatedQuantity});
        const update = { $set: { 
            onSale: item.updatedOnSale, 
            owner: item.updatedOwner, 
            price : item.updatedPrice,
        } }; 
        
        return await collection.updateOne(filter, update);
    }

    public static async delete (itemId: string) {
        const collection = await this.connection();
        return await collection.deleteOne({_id: new Bson.ObjectId(itemId)});
    }
}

export default ItemModel;