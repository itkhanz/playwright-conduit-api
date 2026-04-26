import articleRequestPayload from "../../request-payload/articles/POST_articles.json";
import { expect } from "../../utils/custom-expect";
import { test } from "../../utils/fixtures";


test('Get Articles', async ({ api }) => {

    // const authToken = await createToken('qaaccount@test.com', 'test1234')
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({Authorization: authToken})  //override default Auth with custom token from different user
        // .clearAuth() //no auth
        .getRequest(200)

    // Pass true as third argument to regenerate schema if Api spec changes. 
    // Remove 'true' after generating schema, otherwise it always generates new schema and test keeps passing
    await expect(response).shouldMatchSchema('articles', 'GET_articles')

    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    await expect(response).shouldMatchSchema('tags', 'GET_tags')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
    expect(response.tags[0]).shouldEqual('Test')
})

test('Create, Update, Delete, and Get Article', async ({ api }) => {

    const articleRequest = structuredClone(articleRequestPayload)

    const newArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(newArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(newArticleResponse.article.title).shouldEqual("Second article")
    const articleSlug = newArticleResponse.article.slug

    articleRequest.article.title = "Edited article"

    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .body(articleRequest)
        .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual("Edited article")
    const updatedArticleSlug = updateArticleResponse.article.slug

    const getArticlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(getArticlesResponse.articles[0].title).shouldEqual('Edited article')

    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .deleteRequest(204)

    const finalArticlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(finalArticlesResponse.articles[0].title).not.shouldEqual('Edited article')
})