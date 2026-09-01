import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  describe('formatMessage', () => {
    it('should format message as TSKV', () => {
      const result = logger.formatMessage('log', 'Test message', 'TestContext');

      expect(result).toBe(
        'level=log\tmessage=Test message\tparam1=TestContext\n',
      );
    });

    it('should escape tabs and new lines', () => {
      const result = logger.formatMessage('log', 'Test\tmessage\nnext line');

      expect(result).toBe('level=log\tmessage=Test\\tmessage\\nnext line\n');
    });
  });

  describe('log', () => {
    it('should write formatted message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Test message', 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=log\tmessage=Test message\tparam1=TestContext\n',
      );

      consoleSpy.mockRestore();
    });
  });
});
