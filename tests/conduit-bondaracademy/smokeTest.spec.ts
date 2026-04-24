import { expect } from "@playwright/test";
import { test } from "../../utils/fixtures.ts";

let authToken: string

test.beforeAll('Get Token', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({ "user": { "email": "itkhanz@test.com", "password": "test1234" } })
        .postRequest(200)

    authToken = 'Token ' + tokenResponse.user.token
})

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

test('Create, Update, Delete, and Get Article', async ({ api }) => {

    const newArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({ "article": { "title": "Second article", "description": "About", "body": "Details", "tagList": ["test"] } })
        .postRequest(201)

    expect(newArticleResponse.article.title).toEqual("Second article")
    const articleSlug = newArticleResponse.article.slug

    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .headers({ Authorization: authToken })
        .body({ "article": { "title": "Edited article", "description": "About", "body": "Details", "tagList": ["test"] } })
        .putRequest(200)

    expect(updateArticleResponse.article.title).toEqual("Edited article")
    const updatedArticleSlug = updateArticleResponse.article.slug

    const getArticlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(getArticlesResponse.articles[0].title).toEqual('Edited article')

    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const finalArticlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(finalArticlesResponse.articles[0].title).not.toEqual('Edited article')

})