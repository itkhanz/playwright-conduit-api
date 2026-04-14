import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll('Generate Token', async ({ request }) => {
    const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { "user": { "email": "itkhanz@test.com", "password": "test1234" } }
    })

    const tokenJSON = await tokenResponse.json()
    // console.log(tokenJSON)
    authToken = tokenJSON.user.token
})

test('Get Tags', async ({ request }) => {
    const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
    const tagsResponseJSON = await tagsResponse.json()

    // console.log(tagsResponseJSON)

    expect(tagsResponse.status()).toEqual(200)
    expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
    expect(tagsResponseJSON.tags[0]).toEqual('Test')
    expect(tagsResponseJSON.tags).toEqual(
        expect.arrayContaining(["Test", "Blog"])
    )
});

test('Get All Articles', async ({ request }) => {
    const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const articlesJSON = await articlesResponse.json()

    expect(articlesResponse.status()).toEqual(200)
    expect(articlesJSON.articlesCount).toEqual(10)
    expect(articlesJSON).toHaveProperty('articles')
    expect(articlesJSON.articles[0].author.bio).toBeNull()
    expect(articlesJSON.articles[0].tagList.length).toEqual(4)
    expect(articlesJSON.articles[0].tagList).toContain('Bondar Academy')
    expect(articlesJSON.articles[0]).toEqual(
        expect.objectContaining({
            author: expect.any(Object),
        })
    )
});

test('Create, Update, Get, and Delete Article', async ({ request }) => {

    // =================================================================
    // Create Article
    // =================================================================
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        data: {
            "article": {
                "title": "Second article",
                "description": "About",
                "body": "Details",
                "tagList": [
                    "test"
                ]
            }
        },
        headers: {
            Authorization: `Token ${authToken}`
        }
    })


    const newArticleJSON = await newArticleResponse.json()
    expect(newArticleResponse.status()).toEqual(201)
    const articleSlug = newArticleJSON.article.slug

    // =================================================================
    // Update Article
    // =================================================================
    const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
        data: {
            "article": {
                "title": "Edited article",
                "description": "About",
                "body": "Details",
                "tagList": [
                    "test"
                ]
            }
        },
        headers: {
            Authorization: `Token ${authToken}`
        }
    })


    const updateArticleJSON = await updateArticleResponse.json()
    expect(updateArticleResponse.status()).toEqual(200)
    expect(updateArticleJSON.article.title).toEqual('Edited article')


    // =================================================================
    // Get Article
    // =================================================================
    const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
        headers: {
            Authorization: `Token ${authToken}`
        }
    })
    const articlesJSON = await articlesResponse.json()

    expect(articlesResponse.status()).toEqual(200)
    expect(articlesJSON.articles[0].title).toEqual('Edited article')


    // =================================================================
    // Delete Article
    // =================================================================
    const editedSlug = articlesJSON.articles[0].slug

    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${editedSlug}`, {
        headers: {
            Authorization: `Token ${authToken}`
        }
    })

    expect(deleteArticleResponse.status()).toEqual(204)


});