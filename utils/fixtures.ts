import { test as base } from "@playwright/test";
import { config } from "../config/config-loader";
import { createToken } from "../helpers/createToken";
import { RequestHandler } from "./RequestHandler";
import { setCustomExpectLogger } from "./custom-expect";
import { APILogger } from "./logger";

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export type WorkerFixture = {
    authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({

    authToken: [async ({ }, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword)
        await use(authToken)
    }, { scope: 'worker' }],

    api: async ({ request, authToken }, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken)
        await use(requestHandler)
    },

    config: async ({ }, use) => {
        await use(config)
    }
})