import { faker } from '@faker-js/faker';
import articleRequestPayload from "../request-payload/articles/POST_articles.json";

export function getNewRandomArticle() {
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(8)
    articleRequest.article.body = faker.lorem.paragraph(8)
    return articleRequest
}

