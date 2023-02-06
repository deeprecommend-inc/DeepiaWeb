import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Adsense = () => {
    const { asPath } = useRouter();

    useEffect(() => {
        // try {
        //     (window.adsbygoogle = window.adsbygoogle || []).push({});
        // } catch (err) {
        //     console.log(err);
        // }
    }, [asPath]);

    return (
        <div key={asPath}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-2370440619895423"
                data-ad-slot="3903266588"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default Adsense;
