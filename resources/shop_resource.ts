import BaseResource from "../resources/base_resource.ts"
import UserModel from "../models/user_model.ts";
import ItemModel from "../models/item_model.ts";
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";

class ShopResource extends BaseResource {
    static paths = [
        "/",
    ]

    /*

        Get - get all item containers which have simplified view for user

        Post - sell item (change status, assign new owner) (only with token)

    */

    public async GET() {
        const items = await ItemModel.getAllInShop(0,0);

        const itemContainers = [];
        
        for (let x in items) {
            const a = itemContainers.findIndex(({name}) => name === items[x].name);

            if (a == -1) {
                itemContainers.push({name: items[x].name, quantity: 1, price: items[x].price})
            }
            else {
                itemContainers[a].quantity += 1;
            }
        }

        this.response.body = itemContainers;
        this.response.status_code = 201;

        return this.response;
        
    }

    public async POST() {
        // TOKEN ///////////////////////////////////////////
        const cookie = this.request.getCookie("JWT");
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "Unauthorized access");
        }
        const username = payload.username as string || "";
        if (!username) {
            return this.errorResponse(401, "Unauthorized access");
        }
        // PARAMS ///////////////////////////////////////////
        const itemName = ValidationService.decodeInput(this.request.getBodyParam("name") as string || "");
        
        if (!itemName) {
            return this.errorResponse(422, "Name field is required")
        }
        
        // get item and buyer user

        // good point, but doesn't work. Maybee it needs timeout?
        /*
        const [itemBuyer, item] = await Promise.all([
            UserModel.getByUsername(username), 
            ItemModel.getByNameOnSale(itemName as string)
        ]);
        */
       // FINDING ITEM AND USER ////////////////////////////////////
       
       // rofl, but this helps reduce wait from ~800 ms to ~770ms (in ~ 880 items), but thats prob because of Atlas ping or my laptop being faster don't know
       // but I need to get fresh count without reloading the page
       // there should be a way to take the first item and keep counting,
       // while everything else executes with that first item, Maybe an async function launched at the begining and awaited at the end will do that or i'm wrong and have no idea how async works...
       // but anyway, .find from connection is still slower ~ 860ms
       // no idea how to use .lean with MongoClient
       const i = await ItemModel.getAllInShop(0,0);
       var countItems= 0;
       var item = undefined;
       for (let x in i) {
        if (i[x].name == itemName) {
            if (countItems == 0) {
                if (i) {
                    item = i[x]
                }
            }
            countItems += 1
            }
        }
        
       //const item = await ItemModel.getByNameOnSale(itemName);
       const itemBuyer = await UserModel.getByUsername(username);
        if (!item) {
            return this.errorResponse(401, "All items are sold");
        }
        if (!itemBuyer) {
            return this.errorResponse(500, "Username not found");
        }
        
        // get item seller
        const itemSeller = await UserModel.getByUsername(item.owner);
        
        // UPDATE ///////////////////////////////////////////////////
        var updatedItemSeller;

        // if item seller is not admin or not deleted (registration restricts registering username as "admin")
        if (itemSeller) {
            updatedItemSeller = {
                id: itemSeller._id,
                updatedEcash: (itemSeller.ecash + item.price).toFixed(2),
            };
        }

        const updatedItem = {
            id: item._id,
            updatedOwner: itemBuyer.username,
            updatedOnSale: false,
        };

       
        const updatedItemBuyer = {
            id: itemBuyer._id,
            updatedEcash: (itemBuyer.ecash - item.price).toFixed(2),
        };

        if (updatedItemSeller) {
            await UserModel.update(updatedItemBuyer);
            await ItemModel.update(updatedItem);
            await UserModel.update(updatedItemSeller);
            // sad
            /*
            await Promise.all([
                UserModel.update(updatedItemBuyer), 
                ItemModel.update(updatedItem),
                UserModel.update(updatedItemSeller),
            ]);
            */
        }
        else {
            await UserModel.update(updatedItemBuyer);
            await ItemModel.update(updatedItem);
            /*
            await Promise.all([
                UserModel.update(updatedItemBuyer), 
                ItemModel.update(updatedItem),
            ]);
            */
        }
        

        const val = {
            count: countItems
        }

        this.response.body = val;
        this.response.status_code = 201;
        return this.response;
    }

}

export default ShopResource;