import { piApiService, GenerationRequest } from '../services/piapi.service';

// モックaxios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn()
}));

const mockAxios = require('axios');

describe('PiAPIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateImage', () => {
    it('should generate image with Midjourney successfully', async () => {
      const mockResponse = {
        data: {
          id: 'test-id-123',
          result: {
            url: 'https://example.com/generated-image.jpg',
            thumbnail: 'https://example.com/thumbnail.jpg'
          }
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const request: GenerationRequest = {
        prompt: 'a beautiful cyberpunk city',
        model: 'midjourney',
        aspectRatio: '16:9'
      };

      const result = await piApiService.generateImage(request);

      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://piapi.ai/api/v1/midjourney/generate',
        {
          prompt: 'a beautiful cyberpunk city',
          aspect_ratio: '16:9',
          process_mode: 'fast',
          webhook_endpoint: '',
          webhook_secret: ''
        },
        {
          headers: {
            'X-API-Key': 'c53e4ef1f0db3d7650c894c9dd77ed88f4a7efef37b728b2a619525c7e716fe8',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual({
        id: 'test-id-123',
        status: 'processing',
        result: mockResponse.data.result
      });
    });

    it('should handle generation failure', async () => {
      mockAxios.post.mockRejectedValue(new Error('API Error'));

      const request: GenerationRequest = {
        prompt: 'test prompt',
        model: 'midjourney'
      };

      await expect(piApiService.generateImage(request)).rejects.toThrow('画像生成に失敗しました');
    });
  });

  describe('generateVideo', () => {
    it('should generate video with Dream Machine successfully', async () => {
      const mockResponse = {
        data: {
          id: 'video-id-456',
          result: {
            url: 'https://example.com/generated-video.mp4'
          }
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const request: GenerationRequest = {
        prompt: 'a flying car in the sky',
        model: 'dream_machine',
        duration: '10s',
        resolution: '1080p'
      };

      const result = await piApiService.generateVideo(request);

      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://piapi.ai/api/v1/dream-machine/generate',
        {
          prompt: 'a flying car in the sky',
          duration: '10s',
          quality: '1080p',
          aspect_ratio: '16:9'
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'c53e4ef1f0db3d7650c894c9dd77ed88f4a7efef37b728b2a619525c7e716fe8'
          })
        })
      );

      expect(result.id).toBe('video-id-456');
      expect(result.status).toBe('processing');
    });
  });

  describe('generateMusic', () => {
    it('should generate music with Suno successfully', async () => {
      const mockResponse = {
        data: {
          id: 'music-id-789',
          result: {
            url: 'https://example.com/generated-music.mp3'
          }
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const request: GenerationRequest = {
        prompt: 'epic orchestral music for adventure',
        model: 'suno'
      };

      const result = await piApiService.generateMusic(request);

      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://piapi.ai/api/v1/suno/generate',
        {
          custom_mode: false,
          input: {
            prompt: 'epic orchestral music for adventure',
            make_instrumental: false
          }
        },
        expect.any(Object)
      );

      expect(result.id).toBe('music-id-789');
    });
  });

  describe('getGenerationStatus', () => {
    it('should check generation status successfully', async () => {
      const mockResponse = {
        data: {
          id: 'test-id-123',
          status: 'completed',
          result: {
            url: 'https://example.com/final-result.jpg'
          }
        }
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await piApiService.getGenerationStatus('test-id-123');

      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://piapi.ai/api/v1/status/test-id-123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'c53e4ef1f0db3d7650c894c9dd77ed88f4a7efef37b728b2a619525c7e716fe8'
          })
        })
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('generate (汎用メソッド)', () => {
    it('should route to correct generation method based on model', async () => {
      const spy = jest.spyOn(piApiService, 'generateImage').mockResolvedValue({
        id: 'test',
        status: 'processing'
      });

      await piApiService.generate({
        prompt: 'test',
        model: 'midjourney'
      });

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should throw error for unsupported model', async () => {
      await expect(piApiService.generate({
        prompt: 'test',
        model: 'unsupported-model'
      })).rejects.toThrow('サポートされていないモデル: unsupported-model');
    });
  });

  describe('waitForCompletion', () => {
    it('should wait for completion successfully', async () => {
      mockAxios.get
        .mockResolvedValueOnce({ data: { id: 'test', status: 'processing' } })
        .mockResolvedValueOnce({ data: { id: 'test', status: 'processing' } })
        .mockResolvedValueOnce({ data: { id: 'test', status: 'completed', result: { url: 'test.jpg' } } });

      const result = await piApiService.waitForCompletion('test', 5, 100);

      expect(result.status).toBe('completed');
      expect(mockAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should timeout after max attempts', async () => {
      mockAxios.get.mockResolvedValue({ data: { id: 'test', status: 'processing' } });

      await expect(piApiService.waitForCompletion('test', 2, 100)).rejects.toThrow('生成がタイムアウトしました');
    });
  });
}); 