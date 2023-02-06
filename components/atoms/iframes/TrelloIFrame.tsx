import React from 'react';
import Script from 'next/script';

const TrelloIFrame = () => {
    return (
        <>
            <blockquote className="trello-board-compact">
                <a href="https://trello.com/b/eTdz7vYs/deeprecommend">
                    Trello Board
                </a>
            </blockquote>
            <Script src="https://p.trellocdn.com/embed.min.js"></Script>
        </>
    );
};

export default TrelloIFrame;
