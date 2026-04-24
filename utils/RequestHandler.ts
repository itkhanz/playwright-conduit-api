import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler {

    private logger: APILogger
    private request: APIRequestContext
    private baseUrl: string | undefined
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
    }

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    params(params: object) {
        this.queryParams = params
        return this
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }

    async getRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('GET', url, this.apiHeaders)
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(statusCode)
        return responseJSON
    }

    async postRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(statusCode)
        return responseJSON
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(statusCode)
        return responseJSON
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('DELETE', url, this.apiHeaders, this.apiBody)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        })
        const actualStatus = response.status()

        this.logger.logResponse(actualStatus)
        expect(actualStatus).toEqual(statusCode)
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }

        return url.toString()
    }

}