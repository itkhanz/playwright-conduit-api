import { request } from "@playwright/test";
import { config } from "../config/config-loader";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/RequestHandler";

export async function createToken(email: string, password: string) {

    //manually importing logger, request, and api fixture so it can be used outside Playwright test independently
    const logger = new APILogger()
    const context = await request.newContext()
    const api = new RequestHandler(context, config.apiUrl, logger)

    try {
        const tokenResponse = await api
            .path('/users/login')
            .body({ "user": { "email": email, "password": password } })
            .postRequest(200)

        return 'Token ' + tokenResponse.user.token
    } catch (error: any) {
        Error.captureStackTrace(error, createToken)
        throw error
    } finally {
        context.dispose()
    }
}