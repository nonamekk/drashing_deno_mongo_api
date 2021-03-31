import {Drash} from "./deps.ts";
import InventoryResource from "./resources/inventory_resource.ts";
import ItemResource from "./resources/item_resource.ts";
import LoginResource from "./resources/login_resource.ts";
import RegistrationResource from "./resources/registration_resource.ts"
import ShopResource from "./resources/shop_resource.ts";
import UserResource from "./resources/user_resource.ts";
import ItemsResource from "./resources/items_resource.ts";
import AuthenticationResource from "./resources/authentication_resource.ts";

export const server = new Drash.Http.Server({
    directory: ".",
    response_output: "application/json",
    resources: [
        AuthenticationResource,
        ShopResource,
        LoginResource,
        RegistrationResource,
        UserResource,
        InventoryResource,
        // administartion functionality (item management)
        ItemResource,
        ItemsResource,
    ],
    // ask documentation later about static_paths
    //static_paths: ["/public"]
});

server.run({
    hostname: "localhost",
    port: 4951,
});

console.log("🦕 Deno runs at: http://localhost:4951");