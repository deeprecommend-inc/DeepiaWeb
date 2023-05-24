type Props = {
    uri: string;
};

export const ImgDataURI = ({ uri }: Props) => {
    return <img src={'data:image/png;base64,' + uri} />;
};
