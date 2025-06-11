import '@testing-library/jest-dom';

// MUIのテーマプロバイダーモック
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    breakpoints: {
      down: () => false,
      up: () => true
    },
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' }
    }
  })
}));

// Next.js routerのモック
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// styled-componentsのモック
jest.mock('styled-components', () => {
  const styled = (tag) => (styles) => (props) => {
    const Component = tag;
    return <Component {...props} />;
  };
  
  // よく使われるHTMLタグ用のスタイリング関数を追加
  styled.div = styled('div');
  styled.video = styled('video');
  styled.img = styled('img');
  styled.button = styled('button');
  
  return styled;
});

// Redux関連のモック
jest.mock('../redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector) => {
    // デフォルトの状態を返す
    const defaultState = {
      auth: {
        isAfterLogin: true,
        currentUser: {
          id: 1,
          name: 'Test User',
          image: 'https://via.placeholder.com/40'
        }
      },
      ui: {
        dark: false,
        loading: false
      },
      content: {
        list: []
      }
    };
    return selector(defaultState);
  }
}));

// localeフックのモック  
jest.mock('../hooks/useLocale', () => ({
  useLocale: () => ({
    t: {
      index: {
        head: {
          title: 'Test Title',
          description: 'Test Description'
        }
      }
    },
    locale: 'ja'
  })
}));

// ファイルモックの設定
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// IntersectionObserver のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  
  observe() {
    return null;
  }
  
  unobserve() {
    return null;
  }
  
  disconnect() {
    return null;
  }
};

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// console.errorをモック（テスト中の不要なエラーログを抑制）
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 