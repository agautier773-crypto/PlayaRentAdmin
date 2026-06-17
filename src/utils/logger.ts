type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, source: string, message: string, data?: unknown) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const prefix = `[${timestamp}] [${source}]`;
    
    switch (level) {
        case 'error':
            console.error(prefix, message, data ?? '');
            break;
        case 'warn':
            console.warn(prefix, message, data ?? '');
            break;
        case 'debug':
            console.debug(prefix, message, data ?? '');
            break;
        default:
            console.log(prefix, message, data ?? '');
    }
}

export const logger = {
    info: (source: string, message: string, data?: unknown) => log('info', source, message, data),
    warn: (source: string, message: string, data?: unknown) => log('warn', source, message, data),
    error: (source: string, message: string, data?: unknown) => log('error', source, message, data),
    debug: (source: string, message: string, data?: unknown) => log('debug', source, message, data),
};