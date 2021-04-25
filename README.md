# drashing_deno_mongo_api
First API server. Built on Deno with Drash to use with MongoDB

.change.env < .env




What is bad?
 - ~~New connection created on each request~~
 - Comments
 - ~~Promise any~~
 - Constructors? Nope, but don't think its critical
 - Calling await individually and not 2 or more at once, tried Promise.all, didn't work
 - Connects to individual primary cluster of mongo Atlas (folks say mongov0.13.0 works with URI connection)
 - No additional security
 - ~~AssertionError when requesting to much from mongo~~ Update mongo driver to 0.22

What is good?
 - Authentification with JWT, saves token to response cookie
 - Basic item management functionality
 - More or less clean code

Other
  - Commented code, which works with Bearer Authentification
  - If VSCode says request or response doesn't exist - restart VSCode. If that didn't help try ctrl+x everything in deps.ts, and save, restart VSCode, click on every resource, ctrl+v everything in deps.ts and save, restart VSCode. Don't spam click every resource. Window restart was not helping much.

path | GET | POST
--- | --- | ---
/ | Get list of items names and their quantity | Send "name" to buy the item, returns quantity of that item left to be purchased 
/authentication | If token is active in header, returns username and ecash of the token owner, else return false | Send your cookie to delete it
/login | | Send "email" and "password"
/register | | Send "email", "username" and "password"
/user/:username/inventory | Inventory owner is able to see the list of purchased items | Send "name" to put item on sale
/user/:username | Return username from db |
/admin/item | Get list of owners and quantity of owned items | Send "name" and "price" to create item
/admin/items | | Send "name" and "quantity" to add n amount to already existing item
