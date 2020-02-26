import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { DataSource } from '../../core/datasource';
import { DataSourceConfig } from '../../core/datasource-config';



/**
 * Service handling http requests for the application
 *
 * @Singleton
 * @implements {DataSource}
 */
@Injectable()
export class HttpDataSource implements DataSource {

    constructor(public http: HttpClient) { }

    /**
     * gets headers from request config
     * @param  config request config
     * @return        headers
     */
    private getHeaders(headers: { [key: string]: string }): HttpHeaders {
        let reqHeaders: HttpHeaders = null;
        reqHeaders = new HttpHeaders();
        _.forEach(headers, (val, key) => {
            if (val) {
                reqHeaders = reqHeaders.set(key, val.toString());
            }
        });
        return reqHeaders;
    }

    /**
     * gets params from request config
     * @param  config request config
     * @return        params
     */
    private getParams(queryParams: { [key: string]: any }): HttpParams {
        let params: HttpParams = null;
        params = new HttpParams();
        _.forEach(queryParams, (val, key) => {
            if (val) {
                params = params.set(key, val.toString());
            }
        });
        return params;
    }

    /**
     * @inheritdoc
     */
    public get<TResponseData = any>(
        dsConfig: DataSourceConfig
    ): Observable<TResponseData> {
        const respType: any = dsConfig.responseType || 'json';
        return this.http
            .get<TResponseData>(dsConfig.url, {
                observe: 'response',
                responseType: respType,
                headers: this.getHeaders(dsConfig.headers),
                params: this.getParams(dsConfig.params.query)
            })
            .pipe(
                catchError(err => {
                    throw err;
                }),
                map((resp: HttpResponse<TResponseData>) => {
                    return resp.body;
                })
            );
    }

    /**
     * @inheritdoc
     */
    public put<TRequest, TResponse = any>(
        request: TRequest,
        dsConfig: DataSourceConfig
    ): Observable<TResponse> {
        return;
    }

    /**
     * @inheritdoc
     */
    public post<TRequest, TResponse = any>(
        request: TRequest,
        dsConfig: DataSourceConfig
    ): Observable<TResponse> {
        return;
    }

    /**
     * @inheritdoc
     */
    public delete(dsConfig: DataSourceConfig): Observable<void> {
        return;
    }
}
