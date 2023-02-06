import React from 'react';
import Script from 'next/script';

const TwitterIFrame = () => {
    return (
        <>
            <a
                className="twitter-timeline"
                href="https://twitter.com/DeepRecommend?ref_src=twsrc%5Etfw"
            >
                Tweets by DeepRecommend
            </a>
            <Script
                async
                src="https://platform.twitter.com/widgets.js"
            ></Script>
        </>
    );
};

export default TwitterIFrame;
