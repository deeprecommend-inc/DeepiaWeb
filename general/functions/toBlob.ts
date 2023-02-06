import * as loadImage from 'blueimp-load-image';

export const toBlob = (
    file: string,
    options?: loadImage.LoadImageOptions
): Promise<Blob> => {
    return new Promise((resolve) => {
        loadImage(
            file,
            (image) => {
                (image as HTMLCanvasElement).toBlob((blob) => {
                    if (blob) resolve(blob);
                });
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