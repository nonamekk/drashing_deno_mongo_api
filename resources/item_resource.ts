import BaseResource from "../resources/base_resource.ts"
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";
import ItemModel from "../models/item_model.ts";

/*
    // restricted access - requires admin user with verified token "role = admin", but currenly default users can

    Post - create new item

    //Update - change items price 
*/

class ItemResource extends BaseResource {
    static paths = [
        "/admin/item"
    ]


    public async GET() {
        const items = await ItemModel.getAll(0,0);

        const itemOwnerContainers = [];
        
        for (let x in items) {
            const a = itemOwnerContainers.findIndex(({owner}) => owner === items[x].owner);

            if (a == -1) {
                itemOwnerContainers.push({owner: items[x].owner, quantity: 1})
            }
            else {
                itemOwnerContainers[a].quantity += 1;
            }
        }

        this.response.body = itemOwnerContainers;
        this.response.status_code = 201;

        return this.response;
    }
   
    public async POST() {
        
        // Verify token and get username
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            return this.errorResponse(401, "Cookie monster ate your cookie!");
        }
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "Unauthorized access");
        }
        //const username = payload.username;
        const userRole = payload.role;
        // change to admin
        if (userRole != "default") {
            return this.errorResponse(401, "Unauthorized access");
        }

        // Get params
        const itemName = ValidationService.decodeInput(this.request.getBodyParam("name") as string) || "";
        const price = ValidationService.decodeInput(this.request.getBodyParam("price") as string) || "";
        //const image = ValidationService.decodeInput(this.request.getBodyParam("image") as string) || "";

        if (!itemName) {
            return this.errorResponse(422, "Name field is required");
        }
        if (!price) {
            return this.errorResponse(422, "Price field is required");
        }
        const itemPrice = Number(price);
        if (itemPrice < 0.01) {
            return this.errorResponse(422, "Item price can't be less than 0.01");
        }

        // form an object
        const newItem = {
            name: itemName,
            price: itemPrice,
            owner: "admin",
            onSale: true,
        };

        const item = await ItemModel.create(newItem);

        this.response.body = item;
        this.response.status_code = 201;
        return this.response;

    }
    

}

export default ItemResource;