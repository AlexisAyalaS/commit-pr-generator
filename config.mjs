// config.mjs
import { existsSync, readFileSync } from 'fs';
import Logger from './logger.mjs';

export class Config {
    constructor(logger) {
        this.logger = logger;
        this.config = this.loadConfig();
    }

    /**
     * Carga la configuración desde archivo o usa valores por defecto
     */
    loadConfig() {
        const configFile = 'commit-pr-config.json';
        const defaultConfig = {
            prompts: {
                default: "Please draft markdown for a pull request with the following requirements:\n\n1. Title: Clear, concise description of changes with relevant emoji\n2. Body:\n   - Detailed description of changes\n   - Technical implementation notes if relevant\n   - Demo section for images/videos (if applicable)\n3. Format: Use Conventional Commits standard\n4. Exclude: 'Related Issues' or 'Checklist' sections\n\nGit Diff of changes:",
                commit: "Please generate a commit message following Conventional Commits standard:\n\n1. Format: type(scope): description\n2. Types: feat, fix, docs, style, refactor, test, chore\n3. Include relevant emoji\n4. Keep description under 50 characters\n\nGit Diff of changes:",
                detailed: "Please create a comprehensive pull request description with:\n\n1. Title with emoji and clear description\n2. Overview of changes\n3. Technical details and implementation notes\n4. Breaking changes (if any)\n5. Testing instructions\n6. Screenshots/demos (if applicable)\n7. Follow Conventional Commits format\n\nGit Diff of changes:",
                "branch-name": "Please suggest appropriate branch names for these changes following Git naming conventions:\n\nRequirements:\n1. Use lowercase letters and hyphens (kebab-case)\n2. Be descriptive but concise (max 50 characters)\n3. Include type prefix: feat/, fix/, docs/, style/, refactor/, test/, chore/\n4. Suggest 3-5 different options\n5. Consider the main functionality being added/changed\n\nFormat your response as:\n- option1\n- option2\n- option3\n- option4\n- option5\n\nGit Diff of changes:"
            },
            defaultExclusions: [
                "package-lock.json",
                "node_modules",
                ".env",
                ".env.*",
                "coverage",
                "dist",
                "yarn.lock",
                ".php",
                "*.log",
                "*.tmp",
                ".DS_Store"
            ],
            logging: {
                level: "info",
                enableColors: true
            },
            git: {
                checkStagedChanges: true,
                checkUnstagedChanges: true,
                maxDiffSize: 50000
            },
            language: "en"
        };

        if (existsSync(configFile)) {
            try {
                this.logger.debug('Cargando configuración desde commit-pr-config.json');
                const fileContent = readFileSync(configFile, 'utf-8');
                const fileConfig = JSON.parse(fileContent);
                
                // Merge con configuración por defecto
                const mergedConfig = this.mergeDeep(defaultConfig, fileConfig);
                this.logger.debug('Configuración cargada exitosamente');
                return mergedConfig;
            } catch (error) {
                this.logger.warn('Error cargando configuración, usando valores por defecto:', error.message);
                return defaultConfig;
            }
        }

        this.logger.debug('No se encontró archivo de configuración, usando valores por defecto');
        return defaultConfig;
    }

    /**
     * Merge profundo de objetos
     */
    mergeDeep(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeDeep(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * Obtiene patrones de exclusión por defecto
     */
    getDefaultExclusions() {
        return this.config.defaultExclusions;
    }

    /**
     * Obtiene configuración de logging
     */
    getLoggingConfig() {
        return this.config.logging;
    }

    /**
     * Obtiene configuración de Git
     */
    getGitConfig() {
        return this.config.git;
    }

    /**
     * Obtiene toda la configuración
     */
    getAll() {
        return this.config;
    }

    /**
     * Obtiene el idioma configurado
     */
    getLanguage() {
        return this.config.language || 'en';
    }

    /**
     * Obtiene prompts según el idioma configurado
     */
    getPrompt(type = 'default') {
        const language = this.config.language || 'en';
        
        // Si el idioma es español, usar prompts en español
        if (language === 'es') {
            const spanishPrompts = {
                default: "Por favor crea una descripción de pull request en markdown con los siguientes requisitos:\n\n1. Título: Descripción clara y concisa de los cambios con emoji relevante\n2. Cuerpo:\n   - Descripción detallada de los cambios\n   - Notas técnicas de implementación si es relevante\n   - Sección de demo para imágenes/videos (si aplica)\n3. Formato: Usar estándar Conventional Commits\n4. Excluir: Secciones de 'Issues Relacionados' o 'Checklist'\n\nGit Diff de cambios:",
                commit: "Por favor genera un mensaje de commit siguiendo el estándar Conventional Commits:\n\n1. Formato: tipo(alcance): descripción\n2. Tipos: feat, fix, docs, style, refactor, test, chore\n3. Incluir emoji relevante\n4. Mantener descripción bajo 50 caracteres\n\nGit Diff de cambios:",
                detailed: "Por favor crea una descripción completa de pull request con:\n\n1. Título con emoji y descripción clara\n2. Resumen de cambios\n3. Detalles técnicos y notas de implementación\n4. Cambios que rompen compatibilidad (si los hay)\n5. Instrucciones de testing\n6. Screenshots/demos (si aplica)\n7. Seguir formato Conventional Commits\n\nGit Diff de cambios:",
                "branch-name": "Por favor sugiere nombres apropiados de rama para estos cambios siguiendo las convenciones de Git:\n\nRequisitos:\n1. Usar letras minúsculas y guiones (kebab-case)\n2. Ser descriptivo pero conciso (máx 50 caracteres)\n3. Incluir prefijo de tipo: feat/, fix/, docs/, style/, refactor/, test/, chore/\n4. Sugerir 3-5 opciones diferentes\n5. Considerar la funcionalidad principal que se está agregando/cambiando\n\nFormatea tu respuesta como:\n- opcion1\n- opcion2\n- opcion3\n- opcion4\n- opcion5\n\nGit Diff de cambios:"
            };
            return spanishPrompts[type] || spanishPrompts.default;
        }
        
        // Por defecto usar prompts en inglés
        return this.config.prompts[type] || this.config.prompts.default;
    }
}
