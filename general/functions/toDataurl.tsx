import * as loadImage from 'blueimp-load-image';

export const toDataUrl = (
    file: string | File | Blob,
    options?: loadImage.LoadImageOptions
) => {
    return new Promise<string>((resolve) => {
        loadImage(
            file,
            (image) => {
                resolve((image as HTMLCanvasElement).toDataURL());
            },
            {
                canvas: true,
                meta: true,
                orientation: true,
                ...options,
            }
        );
    });
};