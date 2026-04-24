import { test as base } from "@playwright/test";
import { RequestHandler } from "./RequestHandler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";

//Needed to fix Intellisense to show the methods available inside api fixture
export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export const test = base.extend<TestOptions>({
    //api is the name of fixture, value of the fixture is asynchronus function
    //first argument should be the object with depenedencies that is to be passed into the fixture e.g. request fixture
    //use functions is a special PW function that is always the second argument
    api: async ({ request }, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiUrl, logger)
        await use(requestHandler) //All the code before use is executed after the test, and the code after use is executed after test
    },

    config: async ({ }, use) => {
        await use(config)
    }
})