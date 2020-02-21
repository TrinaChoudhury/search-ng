export interface Image {
    id: string;
    title: string;
    description: string;
    userName: string;
    fullName: string;
    favCount: number;
    commentsCount: Number;
    squareSmallSize: ImageMeta;
    squareLargeSize: ImageMeta;
    thumbSize: ImageMeta;
    normalSize: ImageMeta;
    modalSize: ImageMeta;
    originalSize: ImageMeta;
}

export type ImageMeta = {
    url: string;
    height: number;
    width: number;
}

export const DEFAULT_IMG_PROPERTIES = {
    thumbHeight: 100,
    thumbWidth: 100,
    sqHeight: 150,
    sqWidth: 150
};
