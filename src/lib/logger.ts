/**
 * 自定义日志工具
 * 在生产环境中自动禁用 console.log，但保留 console.error
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

class Logger {
  /**
   * 普通日志 - 开发环境显示，生产环境不显示
   */
  static log(...args: any[]): void {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * 信息日志 - 开发环境显示，生产环境不显示
   */
  static info(...args: any[]): void {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  /**
   * 调试日志 - 开发环境显示，生产环境不显示
   */
  static debug(...args: any[]): void {
    if (isDevelopment) {
      console.debug(...args);
    }
  }

  /**
   * 警告日志 - 开发环境显示，生产环境不显示
   */
  static warn(...args: any[]): void {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  /**
   * 错误日志 - 开发和生产环境都显示
   */
  static error(...args: any[]): void {
    console.error(...args);
  }

  /**
   * 开发环境专用日志 - 只在开发环境显示
   */
  static dev(...args: any[]): void {
    if (isDevelopment) {
      console.log('[DEV]', ...args);
    }
  }

  /**
   * 生产环境专用日志 - 只在生产环境显示
   */
  static prod(...args: any[]): void {
    if (isProduction) {
      console.log('[PROD]', ...args);
    }
  }

  /**
   * 分组日志 - 开发环境显示
   */
  static group(label: string): void {
    if (isDevelopment) {
      console.group(label);
    }
  }

  /**
   * 结束分组 - 开发环境显示
   */
  static groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * 表格日志 - 开发环境显示
   */
  static table(data: any): void {
    if (isDevelopment) {
      console.table(data);
    }
  }

  /**
   * 时间标记 - 开发环境显示
   */
  static time(label: string): void {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * 结束时间标记 - 开发环境显示
   */
  static timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
}

export default Logger;
