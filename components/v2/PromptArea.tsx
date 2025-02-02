import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip, Checkbox, FormControlLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';

const BackgroundVideo = styled.video`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const LogoHeader = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  color: #fff;
  z-index: 1;
`;

const LogoImage = styled.img`
  height: 50px;
  margin-right: 10px;
`;

const TextBox = () => {
  return (
    <div className="video-description-bar" style={{ width: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 上段：テキスト入力欄 */}
      <div className="input-section" style={{ marginBottom: '0.5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <textarea
          className="text-input"
          placeholder="Describe your video..."
          style={{ borderRadius: '10px', width: '100%', boxShadow: 'none', border: 'none' }}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
       
      </div>

      {/* 下段：各種ボタン */}
      <div className="button-section" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px' }}>+</button>
          <button className="option-button" style={{ borderRadius: '10px' }}>16:9</button>
          <button className="option-button" style={{ borderRadius: '10px' }}>1080p</button>
          <button className="option-button" style={{ borderRadius: '10px' }}>5s</button>
          <button className="option-button" style={{ borderRadius: '10px' }}>1v</button>
          <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px' }}>?</button>
        </div>
        <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px' }}>↑</button>
      </div>
    </div>
  );
}

const PromptArea = () => {
  const [videoIndex, setVideoIndex] = useState(0);
  const videos = ['/deepia2.mp4', '/deepia2-2.mp4', '/deepia2-3.mp4', '/deepia2-4.mp4'];

  const handlePrevVideo = () => {
    setVideoIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  };

  const handleNextVideo = () => {
    setVideoIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div>
      <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px', position: 'absolute', top: '50%', left: '24px', transform: 'translateY(-50%)' }} onClick={handlePrevVideo}>←</button>
      <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px', position: 'absolute', top: '50%', right: '24px', transform: 'translateY(-50%)' }} onClick={handleNextVideo}>→</button>
      <BackgroundVideo key={videoIndex} autoPlay loop muted>
        <source src={videos[videoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      <LogoHeader>
        <LogoImage src="/logo-white.png" alt="Logo" />
        <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Deepia2</h1>
      </LogoHeader>
      <TextBox />
      <button className="option-button" style={{ borderRadius: '50%', width: '40px', height: '40px', position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }} onClick={handleScrollDown}>↓</button>
    </div>
  );
};

export default PromptArea;
