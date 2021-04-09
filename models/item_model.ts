import {Bson} from "../deps.ts"
import {config as dotEnv} from "../config.ts";
import {mongoClient} from "../db.ts";


interface IItem {
    _id: {$oid: string};
    name: string;
    price: number;
    onSale: boolean;
    owner: string;
}


const items = mongoClient.database(dotEnv.mongoDatabase as string).collection<IItem>("items");

export class ItemModel {

    public static async getById(itemId: string) {
        const itemData = await items.findOne(
            { _id: new Bson.ObjectId(itemId) },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async getByName(itemName: string) {
        const itemData = await items.findOne(
            { name: itemName },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async getByNameOnSale(itemName: string): Promise<any> {
        const itemData = await items.findOne(
            { name: itemName, onSale: true },
            { noCursorTimeout: false } as any,
        );
        return itemData;
    }

    public static async create(item: any) {
        return (await items.insertOne(item)).toString();
    }

    public static async getAllInShop (skip: number, limit: number) {
        return await items.find(
            { onSale: true}, 
            { noCursorTimeout: false } as any )
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    public static async getAll (skip: number, limit: number) {
        return await items.find({}, { noCursorTimeout: false } as any).skip(skip)
            .limit(limit).toArray();
    }


    public static async update (item: any) {
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
        
        return await items.updateOne(filter, update);
    }

    public static async delete (itemId: string) {
        return await items.deleteOne({_id: new Bson.ObjectId(itemId)});
    }
}

export default ItemModel;