import { Drash } from "../deps.ts";

export default class BaseResource extends Drash.Http.Resource {
    protected errorResponse( statusCode: number, message: string ): Drash.Http.Response {
        this.response.status_code = statusCode;
        this.response.body = {
            errors: {
                body: [message],
            },
        };
        return this.response;
    }
    
}

