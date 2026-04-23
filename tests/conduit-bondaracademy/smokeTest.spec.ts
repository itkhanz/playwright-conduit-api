import { expect } from "@playwright/test";
import { test } from "../../utils/fixtures.ts";
import { RequestHandler } from "../../utils/RequestHandler.ts";

//Providing api fixture as input instead of request object
test('Get Articles', async ({ api }) => {

    //Need to use await because getRequest() is async function
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)


})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags.length).toBeLessThanOrEqual(10)
    expect(response.tags[0]).toEqual('Test')
})