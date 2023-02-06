type Props = {
    url: string;
};

const Iframe = (props: Props) => {
    const { url } = props;

    return (
        <div className="relative w-full">
            <iframe
                style={{ height: '85.8vh' }}
                className="absolute inset-0 w-full scroll-container"
                src={url}
            ></iframe>
        </div>
    );
};

export default Iframe;
