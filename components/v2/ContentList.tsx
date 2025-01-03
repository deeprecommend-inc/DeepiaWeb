import React from 'react';
import styled from 'styled-components';

const ContentListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  background-color: #000;
  padding: 20px;
`;

const ContentItem = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const TitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px;
  text-align: center;
  font-size: 0.9rem;
`;

const sampleContents = [
  { title: 'Sample Content 1', thumbnail: 'https://via.placeholder.com/150' },
  { title: 'Sample Content 2', thumbnail: 'https://via.placeholder.com/150' },
  { title: 'Sample Content 3', thumbnail: 'https://via.placeholder.com/150' },
];

const ContentList = () => {
  return (
    <ContentListContainer>
      {sampleContents.map((content, index) => (
        <ContentItem key={index}>
          <Thumbnail src={content.thumbnail} alt={content.title} />
          <TitleOverlay>{content.title}</TitleOverlay>
        </ContentItem>
      ))}
    </ContentListContainer>
  );
};

export default ContentList;
