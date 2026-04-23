import { test as base } from "@playwright/test";
import { RequestHandler } from "./RequestHandler";

//Needed to fix Intellisense to show the methods available inside api fixture
export type TestOptions = {
    api: RequestHandler
}

export const test = base.extend<TestOptions>({
    //api is the name of fixture, value of the fixture is asynchronus function
    //first argument should be the object with depenedencies that is to be passed into the fixture
    //use functions is a special PW function that is always the second argument
    api: async ({ }, use) => {
        const requestHandler = new RequestHandler()
        await use(requestHandler) //All the code before use is executed after the test, and the code after use is executed after test

    }
})