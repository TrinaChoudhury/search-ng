import { DataSourceConfig } from "../core/datasource-config";

export const PhotoSearchAPIConfig : DataSourceConfig = {
    url: "https://www.flickr.com/services/rest/",
    params: {
        query : {
            format: 'json',
            method: 'flickr.photos.search',
            nojsoncallback: (1).toString(),
            extras: 'count_comments,count_faves,description,owner_name,path_alias,realname,url_sq,url_q,url_t,url_s,url_n,url_w,url_m,url_z,url_c,url_l'
        }
    }
}
