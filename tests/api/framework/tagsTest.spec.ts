import { expect } from "../../../utils/custom-expect";
import { test } from "../../../utils/fixtures";

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    await expect(response).shouldMatchSchema('tags', 'GET_tags')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
    expect(response.tags[0]).shouldEqual('Test')
})