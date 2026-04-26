import { faker } from '@faker-js/faker';
import articleRequestPayload from "../request-payload/articles/POST_articles.json";
import userRequestPayload from "../request-payload/users/POST_users.json";

export function getNewRandomArticle() {
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = faker.lorem.sentence(5)
    articleRequest.article.description = faker.lorem.sentence(8)
    articleRequest.article.body = faker.lorem.paragraph(8)
    return articleRequest
}

export function getNewRandomUser(userNameLength: number = 3) {
    const userRequest = structuredClone(userRequestPayload)
    userRequest.user.username = faker.string.alphanumeric({ length: userNameLength })
    return userRequest;
}