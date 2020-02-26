import { Observable } from "rxjs/Observable";
import { DataSourceConfig } from "./datasource-config";


/**
 * Data source provides an abstraction over how data would be fetched
 * (Could be a MockHttpClient or an actual Http Client)
 * The interface contains the CRUD operations needed by our application
 * whose implementation can be provided by any third party Client
 * (Like, HttpClient provided by Angular is one such data source)
 */
export interface DataSource {
    /*
        Method for GET operation
     */
    get<TResponse>(dsConfig: DataSourceConfig)
        : Observable<TResponse>;
    /*
        Method for PUT operation.
        TRequest constitutes the Backend understandable model
        TResponse is the UI understandable model after transformation
     */
    put<TRequest, TResponse = any>(data: TRequest, dsConfig: DataSourceConfig)
        : Observable<TResponse>;
    /*
        Method for POST operation.
        TRequest constitutes the Backend understandable model
     */
    post<TRequest, TResponse = any>(data: TRequest, dsConfig: DataSourceConfig)
        : Observable<TResponse>;
    /*
        Method for DELETE operation.
     */
    delete(dsConfig: DataSourceConfig) : Observable<void>;
}
