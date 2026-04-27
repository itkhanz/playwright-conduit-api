import { expect } from "../../../utils/custom-expect";
import { getNewRandomUser } from "../../../utils/data-generator";
import { test } from "../../../utils/fixtures";

[
    { userNameLength: 2, usernameErrorMessage: 'is too short (minimum is 3 characters)' },
    { userNameLength: 3, usernameErrorMessage: '' },
    { userNameLength: 20, usernameErrorMessage: '' },
    { userNameLength: 21, usernameErrorMessage: 'is too long (maximum is 20 characters)' },
].forEach(({ userNameLength, usernameErrorMessage }) => {
    test(`Error message validation for userNameLength ${userNameLength}`, async ({ api }) => {

        const userRequestBody = getNewRandomUser(userNameLength)

        const response = await api
            .path('/users')
            .body(userRequestBody)
            .clearAuth()
            .postRequest(422)

        //generated via https://transform.tools/json-to-json-schema manually once
        await expect(response).shouldMatchSchema('users', 'POST_users')

        if (userNameLength == 3 || userNameLength == 20) {
            expect(response.errors).not.shouldHaveProperty('username')
        } else {
            expect(response.errors.username[0]).shouldEqual(usernameErrorMessage)
            expect(response.errors).shouldEqual(
                expect.objectContaining({
                    email: expect.any(Array),
                    username: expect.any(Array),
                })
            );
        }
    })
})

