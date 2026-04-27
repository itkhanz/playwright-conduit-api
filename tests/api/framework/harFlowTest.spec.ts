import { faker } from "@faker-js/faker";
import { expect } from "../../../utils/custom-expect";
import { getNewRandomArticle } from "../../../utils/data-generator";
import { test } from "../../../utils/fixtures";

test('HAR Flow - Article Lifecycle with Comments', async ({ api }) => {

    // Step 1: Create article with random data
    const articleRequest = getNewRandomArticle()

    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)

    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    expect(createArticleResponse.article.description).shouldEqual(articleRequest.article.description)
    expect(createArticleResponse.article.body).shouldEqual(articleRequest.article.body)

    const articleSlug = createArticleResponse.article.slug
    expect(articleSlug).toBeTruthy()

    // Step 2: Get created article by slug
    const getArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200)

    expect(getArticleResponse.article.slug).shouldEqual(articleSlug)
    expect(getArticleResponse.article.title).shouldEqual(articleRequest.article.title)

    // Step 3: Get article comments (should be empty initially)
    const getCommentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)

    expect(Array.isArray(getCommentsResponse.comments)).shouldEqual(true)
    const initialCommentCount = getCommentsResponse.comments.length

    // Step 4: Create comment on the article
    const commentBody = faker.lorem.sentence(10)
    const createCommentRequest = {
        comment: {
            body: commentBody
        }
    }

    const createCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body(createCommentRequest)
        .postRequest(200)

    expect(createCommentResponse.comment.body).shouldEqual(commentBody)
    expect(createCommentResponse.comment.author).toBeTruthy()

    const commentId = createCommentResponse.comment.id
    expect(commentId).toBeTruthy()

    // Step 5: Delete the comment
    const deleteCommentResponse = await api
        .path(`/articles/${articleSlug}/comments/${commentId}`)
        .deleteRequest(200)

    // Verify comment was deleted by checking comments list
    const getCommentsAfterDeleteResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)

    await expect(getCommentsAfterDeleteResponse).shouldMatchSchema('articles', 'GET_article_comments')
    expect(getCommentsAfterDeleteResponse.comments.length).shouldEqual(initialCommentCount)

    // Step 6: Delete the article
    const deleteArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204)
})
