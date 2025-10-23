// logger.mjs
import chalk from 'chalk';

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    constructor(level = 'info', enableColors = true) {
        this.level = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
        this.enableColors = enableColors;
    }

    _formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const levelStr = level.toUpperCase().padEnd(5);
        
        if (!this.enableColors) {
            return `[${timestamp}] ${levelStr}: ${message}`;
        }

        const colors = {
            DEBUG: chalk.gray,
            INFO: chalk.blue,
            WARN: chalk.yellow,
            ERROR: chalk.red
        };

        return `${chalk.gray(`[${timestamp}]`)} ${colors[levelStr]?.(levelStr) || levelStr}: ${message}`;
    }

    debug(message, ...args) {
        if (this.level <= LOG_LEVELS.DEBUG) {
            console.log(this._formatMessage('DEBUG', message, ...args));
        }
    }

    info(message, ...args) {
        if (this.level <= LOG_LEVELS.INFO) {
            console.log(this._formatMessage('INFO', message, ...args));
        }
    }

    warn(message, ...args) {
        if (this.level <= LOG_LEVELS.WARN) {
            console.warn(this._formatMessage('WARN', message, ...args));
        }
    }

    error(message, ...args) {
        if (this.level <= LOG_LEVELS.ERROR) {
            console.error(this._formatMessage('ERROR', message, ...args));
        }
    }

    success(message, ...args) {
        if (this.enableColors) {
            console.log(chalk.green(`✓ ${message}`), ...args);
        } else {
            console.log(`✓ ${message}`, ...args);
        }
    }

    fail(message, ...args) {
        if (this.enableColors) {
            console.error(chalk.red(`✗ ${message}`), ...args);
        } else {
            console.error(`✗ ${message}`, ...args);
        }
    }
}

export default Logger;
