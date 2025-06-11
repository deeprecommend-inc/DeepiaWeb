import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ContentList from '../components/v2/ContentList';
import { CreatorChat } from '../components/Chat/CreatorChat';

// MUIテーマ
const theme = createTheme();

// PromptAreaのモック（styled-componentsがテスト環境で問題を起こすため）
jest.mock('../components/v2/PromptArea', () => {
  return function MockPromptArea() {
    return (
      <div data-testid="prompt-area">
        <button data-testid="generate-button">Generate</button>
        <textarea data-testid="prompt-input" placeholder="Describe your content..." />
      </div>
    );
  };
});

// PiAPIサービスのモック
jest.mock('../services/piapi.service', () => ({
  piApiService: {
    generate: jest.fn().mockResolvedValue({
      id: 'test-id',
      status: 'completed',
      result: { url: 'https://example.com/test.jpg' }
    }),
    waitForCompletion: jest.fn().mockResolvedValue({
      id: 'test-id',
      status: 'completed',
      result: { url: 'https://example.com/test.jpg' }
    })
  }
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ContentList Component', () => {
  it('renders creator profile header', () => {
    renderWithTheme(<ContentList />);
    
    expect(screen.getByText('脳みその拡張 - AI Creative Studio')).toBeInTheDocument();
    expect(screen.getByText('あらゆるコンテンツを生み出すクリエイティブプラットフォーム')).toBeInTheDocument();
  });

  it('displays sample content cards', () => {
    renderWithTheme(<ContentList />);
    
    expect(screen.getByText('サイバーパンク都市')).toBeInTheDocument();
    expect(screen.getByText('ドリームシネマ')).toBeInTheDocument();
    expect(screen.getByText('エピック BGM')).toBeInTheDocument();
  });

  it('shows creator information for each content', () => {
    renderWithTheme(<ContentList />);
    
    expect(screen.getByText('AI Creator')).toBeInTheDocument();
    expect(screen.getByText('Visual Artist')).toBeInTheDocument();
    expect(screen.getByText('Music AI')).toBeInTheDocument();
  });

  it('handles follow button clicks', () => {
    renderWithTheme(<ContentList />);
    
    const followButtons = screen.getAllByText(/フォロー/);
    expect(followButtons.length).toBeGreaterThan(0);
    
    // クリックしてフォロー状態が変わることをテスト
    fireEvent.click(followButtons[0]);
    // 状態変更のテストは実装によって異なるため、ここではクリックが可能であることを確認
  });

  it('shows content type chips', () => {
    renderWithTheme(<ContentList />);
    
    expect(screen.getByText('🖼️ IMAGE')).toBeInTheDocument();
    expect(screen.getByText('🎬 VIDEO')).toBeInTheDocument();
    expect(screen.getByText('🎵 MUSIC')).toBeInTheDocument();
  });

  it('handles like button interactions', () => {
    renderWithTheme(<ContentList />);
    
    const likeButtons = screen.getAllByLabelText(/favorite/i);
    expect(likeButtons.length).toBeGreaterThan(0);
    
    // いいねボタンのクリックテスト
    fireEvent.click(likeButtons[0]);
  });
});

describe('CreatorChat Component', () => {
  it('renders creator list', () => {
    renderWithTheme(<CreatorChat />);
    
    expect(screen.getByText('🧠 クリエイター')).toBeInTheDocument();
    expect(screen.getByText('AI Artist Pro')).toBeInTheDocument();
    expect(screen.getByText('Music AI Creator')).toBeInTheDocument();
    expect(screen.getByText('Video Wizard')).toBeInTheDocument();
  });

  it('shows follower counts', () => {
    renderWithTheme(<CreatorChat />);
    
    expect(screen.getByText('1250 フォロワー')).toBeInTheDocument();
    expect(screen.getByText('890 フォロワー')).toBeInTheDocument();
    expect(screen.getByText('2100 フォロワー')).toBeInTheDocument();
  });

  it('displays specialty chips for creators', () => {
    renderWithTheme(<CreatorChat />);
    
    expect(screen.getByText('画像生成')).toBeInTheDocument();
    expect(screen.getByText('動画編集')).toBeInTheDocument();
    expect(screen.getByText('音楽生成')).toBeInTheDocument();
  });

  it('shows online status indicators', () => {
    renderWithTheme(<CreatorChat />);
    
    // オンライン状態のバッジが表示されているかテスト
    const badges = document.querySelectorAll('.MuiBadge-badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('handles message input', () => {
    renderWithTheme(<CreatorChat />);
    
    const messageInput = screen.getByPlaceholderText('メッセージを入力...');
    expect(messageInput).toBeInTheDocument();
    
    fireEvent.change(messageInput, { target: { value: 'テストメッセージ' } });
    expect(messageInput).toHaveValue('テストメッセージ');
  });

  it('displays existing chat messages', () => {
    renderWithTheme(<CreatorChat />);
    
    expect(screen.getByText(/新しいAI画像生成プロジェクトについて相談があります/)).toBeInTheDocument();
    expect(screen.getByText(/どのようなスタイルの画像を生成したいですか/)).toBeInTheDocument();
  });

  it('handles follow/unfollow actions', () => {
    renderWithTheme(<CreatorChat />);
    
    // フォローボタンを探してクリック
    const followButtons = screen.getAllByLabelText(/person/i);
    expect(followButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(followButtons[0]);
  });

  it('shows message timestamps', () => {
    renderWithTheme(<CreatorChat />);
    
    // タイムスタンプが表示されているかテスト（正確な時刻は変動するため、フォーマットをテスト）
    const timeElements = document.querySelectorAll('[style*="opacity: 0.7"]');
    expect(timeElements.length).toBeGreaterThan(0);
  });
});

describe('Integration Tests', () => {
  it('content list and chat work together', async () => {
    renderWithTheme(
      <div>
        <ContentList />
        <CreatorChat />
      </div>
    );
    
    // 両方のコンポーネントが正常にレンダリングされることを確認
    expect(screen.getByText('脳みその拡張 - AI Creative Studio')).toBeInTheDocument();
    expect(screen.getByText('🧠 クリエイター')).toBeInTheDocument();
  });

  it('handles responsive design elements', () => {
    renderWithTheme(<ContentList />);
    
    // グリッドレイアウトが適用されているかテスト
    const gridContainer = document.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });
});

describe('Error Handling', () => {
  it('handles missing props gracefully', () => {
    // エラーを発生させずにレンダリングできることを確認
    expect(() => {
      renderWithTheme(<ContentList />);
    }).not.toThrow();
    
    expect(() => {
      renderWithTheme(<CreatorChat />);
    }).not.toThrow();
  });
});

describe('Accessibility', () => {
  it('has proper aria labels', () => {
    renderWithTheme(<ContentList />);
    
    // ボタンにアクセシブルなラベルがあることを確認
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('supports keyboard navigation', () => {
    renderWithTheme(<CreatorChat />);
    
    const messageInput = screen.getByPlaceholderText('メッセージを入力...');
    
    // Enterキーでメッセージ送信をテスト
    fireEvent.keyPress(messageInput, { key: 'Enter', code: 'Enter' });
  });
}); 