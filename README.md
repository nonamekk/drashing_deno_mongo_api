# drashing_deno_mongo_api
First API server. Built on Deno with Drash to use with MongoDB

.change.env < .env

What is bad?
 - New connection created on each request
 - Comments
 - Promise any
 - Connects to individual primary cluster of mongo Atlas (folks say mongov0.13.0 works with URI connection)
 - No additional security

What is good?
 - Authentification with JWT, saves token to response cookie
 - Basic item management functionality
 - More or less clean code

Other
  - Commented code, which works with Bearer Authentification
  - If VSCode says request or response doesn't exist - restart VSCode
