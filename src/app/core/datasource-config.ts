/*
    Configuration required for making a resource API Call
 */
export interface DataSourceConfig {
    /**
     * API URL - could be relative or absolute
     */
    url: string;
    /**
     * The expected response type of the server.
     * This is used to parse the response appropriately before returning it to
     * the requestee.
     */
    responseType?: 'json' | 'arraybuffer' | 'blob';
    /**
     * Outgoing headers for this request.
     */
    headers?: {
        [key: string]: any;
        /**
         * Content-Type of the request to be sent
         * The Content-Type entity header is used to indicate the media type of the resource
         */
        'Content-Type'?: string;
    };
    params: {
        path?: { [key: string]: string | boolean | number };
        query?: { [key: string]: string | boolean | number };
    }
}
