// git-utils.mjs
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import Logger from './logger.mjs';

export class GitUtils {
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Verifica si el directorio actual es un repositorio Git válido
     */
    isGitRepository() {
        try {
            execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica si hay cambios staged
     */
    hasStagedChanges() {
        try {
            const result = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
            return result.trim().length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Verifica si hay cambios unstaged
     */
    hasUnstagedChanges() {
        try {
            const result = execSync('git diff --name-only', { encoding: 'utf-8' });
            return result.trim().length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Obtiene el diff de Git con exclusiones aplicadas
     */
    getGitDiff(excludedPatterns = [], maxSize = 50000) {
        this.logger.debug('Obteniendo git diff con patrones de exclusión:', excludedPatterns);
        
        const isWindows = process.platform === 'win32';
        const excludePrefix = isWindows ? ':!' : ':(exclude)';
        const diffExcludes = excludedPatterns
            .map(pattern => `${excludePrefix}${pattern}`)
            .join(' ');

        const diffCommand = `git diff -- . ${diffExcludes}`;
        
        try {
            const diff = execSync(diffCommand, { encoding: 'utf-8' });
            
            if (diff.length > maxSize) {
                this.logger.warn(`Diff muy grande (${diff.length} caracteres). Truncando a ${maxSize} caracteres.`);
                return diff.substring(0, maxSize) + '\n\n... [diff truncado por tamaño] ...';
            }
            
            return diff;
        } catch (error) {
            this.logger.error('Error ejecutando git diff:', error.message);
            throw new Error(`Error ejecutando git diff: ${error.message}`);
        }
    }

    /**
     * Lee patrones de exclusión desde .prignore o usa los por defecto
     */
    getExclusionPatterns(defaultPatterns = []) {
        const ignoreFile = '.prignore';
        
        if (existsSync(ignoreFile)) {
            this.logger.debug('Archivo .prignore encontrado, leyendo patrones personalizados');
            const ignoreContent = readFileSync(ignoreFile, 'utf-8');
            const patterns = ignoreContent
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
            
            this.logger.debug('Patrones de exclusión cargados:', patterns);
            return patterns;
        }
        
        this.logger.debug('Usando patrones de exclusión por defecto:', defaultPatterns);
        return defaultPatterns;
    }

    /**
     * Valida que hay cambios disponibles para procesar
     */
    validateChanges(checkStaged = true, checkUnstaged = true) {
        const staged = checkStaged ? this.hasStagedChanges() : false;
        const unstaged = checkUnstaged ? this.hasUnstagedChanges() : false;
        
        this.logger.debug(`Validación de cambios - Staged: ${staged}, Unstaged: ${unstaged}`);
        
        if (!staged && !unstaged) {
            throw new Error('No hay cambios detectados en archivos rastreados. Asegúrate de tener cambios staged o unstaged en archivos que no estén en tu lista de exclusión.');
        }
        
        return { staged, unstaged };
    }

    /**
     * Obtiene información del repositorio actual
     */
    getRepositoryInfo() {
        try {
            const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
            const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
            const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf-8' }).trim();
            
            return {
                remoteUrl,
                currentBranch,
                lastCommit
            };
        } catch (error) {
            this.logger.warn('No se pudo obtener información del repositorio:', error.message);
            return {
                remoteUrl: 'unknown',
                currentBranch: 'unknown',
                lastCommit: 'unknown'
            };
        }
    }
}
