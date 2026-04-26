import { expect } from "../../utils/custom-expect";
import { getNewRandomArticle } from "../../utils/data-generator";
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

test('Create, Update, Delete, and Get Article', async ({ api }) => {

    const articleRequest = getNewRandomArticle()

    const newArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(newArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(newArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const articleSlug = newArticleResponse.article.slug

    const updatedArticleRequest = getNewRandomArticle()

    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .body(updatedArticleRequest)
        .putRequest(200)

    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles')
    expect(updateArticleResponse.article.title).shouldEqual(updatedArticleRequest.article.title)
    const updatedArticleSlug = updateArticleResponse.article.slug

    const getArticlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    
    await expect(getArticlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(getArticlesResponse.articles[0].title).shouldEqual(updatedArticleRequest.article.title)

    const deleteArticleResponse = await api
        .path(`/articles/${updatedArticleSlug}`)
        .deleteRequest(204)

    const finalArticlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    
    await expect(finalArticlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(finalArticlesResponse.articles[0].title).not.shouldEqual(updatedArticleRequest.article.title)
})