import test from "@playwright/test";
import { RequestHandler } from "../../utils/RequestHandler.ts";

test('First Test', async ({}) => {

    const api = new RequestHandler()

    api
    .url('https://conduit-api.bondaracademy.com')
    .path('/api/articles')
    .params({limit: 10, offset: 0})
    .headers({Authorization: 'bearer token'})
    .body({ "user": { "email": "itkhanz@test.com", "password": "test1234" }})
    

})