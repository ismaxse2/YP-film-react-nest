import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const fields: Record<string, unknown> = {
      level,
      message,
    };

    optionalParams.forEach((param, index) => {
      fields[`param${index + 1}`] = param;
    });

    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${this.formatValue(value)}`)
        .join('\t') + '\n'
    );
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }

  private formatValue(value: unknown): string {
    let result: string;

    if (typeof value === 'string') {
      result = value;
    } else {
      result = JSON.stringify(value);
    }

    return result
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n');
  }
}
