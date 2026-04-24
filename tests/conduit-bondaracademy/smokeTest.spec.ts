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

    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags.length).shouldBeLessThanOrEqual(10)
    expect(response.tags[0]).shouldEqual('Test')
})

test('Create, Update, Delete, and Get Article', async ({ api }) => {

    const newArticleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Second article", "description": "About", "body": "Details", "tagList": ["test"] } })
        .postRequest(201)

    expect(newArticleResponse.article.title).shouldEqual("Second article")
    const articleSlug = newArticleResponse.article.slug

    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .body({ "article": { "title": "Edited article", "description": "About", "body": "Details", "tagList": ["test"] } })
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