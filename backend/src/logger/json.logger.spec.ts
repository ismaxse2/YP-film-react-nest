import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  describe('formatMessage', () => {
    it('should format message as JSON', () => {
      const result = logger.formatMessage('log', 'Test message', 'TestContext');

      expect(result).toBe(
        JSON.stringify({
          level: 'log',
          message: 'Test message',
          optionalParams: ['TestContext'],
        }),
      );
    });
  });

  describe('log', () => {
    it('should write formatted message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Test message', 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Test message',
          optionalParams: ['TestContext'],
        }),
      );

      consoleSpy.mockRestore();
    });
  });
});
