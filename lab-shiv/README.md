![cf](https://i.imgur.com/7v5ASc8.png) Lab 17 - Bearer Auth
======

## To Submit this Assignment
  * create a new branch from the fork that you created yesterday (lab-15)
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-brian`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

## Include
  * `package.json`
  * `.eslintrc`
  * `gulpfile.js`
  * `.gitignore`
  * `.env`
  * `README.md`

## Description
  * Create a new branch and use the same forked repository from lab 15
  * Create a bearer auth middleware module (feel free to use the one from lecture as a reference point)
  * Create a new resource that has at least three properties
    * this resource must have a property of `userID` that references the `_id` of the user that created the resource
    * the `userID` property can only be set from an `_id` found using your bearer auth middleware module
  * As always, use the **npm** `debug` module to log function calls that are used within your application
  * Using the express `Router`, create routes for doing **RESTFUL CRUD** operations against your resource

## Server Endpoints
### `/api/resource-name`
* `POST` request
 * pass data as stringifed JSON in the body of a post request to create a new resource

### `/api/resource-name/:id`
* `GET` request
 * pass the id of a resource though the url endpoint to `req.params` to fetch a resource   
* `PUT` request
 * pass data as stringifed JSON in the body of a put request to update a resource
* `DELETE` request
 * pass the id of a resource though the url endpoint *(using `req.params`)* to delete a resource   

## Tests
* Create a test to ensure that your API returns a status code of 404 for routes that have not been registered
* Create a series of tests to ensure that your `/api/resource-name` endpoint responds as described for each condition below:
  * `GET` - test **200**, for a request made with a valid id
  * `GET` - test **401**, if no token was provided
  * `GET` - test **404**, for a valid request with an id that was not found
  * `PUT` - test **200**, for a post request with a valid body
  * `PUT` - test **401**, if no token was provided
  * `PUT` - test **400**, if the body was invalid
  * `PUT` - test **404**, for a valid request made with an id that was not found
  * `POST` - test **200**, for a post request with a valid body
  * `POST` - test **401**, if no token was provided
  * `POST` - test **400**, if no body was provided or if the body was invalid

## Bonus
* **1pt:** a `GET` request to `/api/resource-name` should return an array of all of the ids for that resource
* **1pt:** create a series of tests for a `DELETE` request
