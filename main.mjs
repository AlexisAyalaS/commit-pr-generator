#!/usr/bin/env node
// main.mjs - Archivo principal mejorado con flujo simplificado
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import open from 'open';
import { GitUtils } from './git-utils.mjs';
import { Config } from './config.mjs';
import Logger from './logger.mjs';
import { AIClient } from './ai-client.mjs';
import { MarkdownGenerator } from './markdown-generator.mjs';
import fs from 'fs/promises';
import path from 'path';

// Información del paquete
const PACKAGE_INFO = {
    name: 'commit-pr-generator',
    version: '1.0.0',
    author: 'Alexis Ayala Solorio <lex.solorio15@gmail.com>',
    description: 'CLI tool that automates commit messages and pull request descriptions using AI'
};

// Configuración de las plataformas de IA disponibles
const AI_PLATFORMS = {
    chatgpt: {
        url: 'https://chatgpt.com/',
        name: 'ChatGPT',
        emoji: '🤖'
    },
    deepseek: {
        url: 'https://chat.deepseek.com',
        name: 'DeepSeek Chat',
        emoji: '🧠'
    },
    gemini: {
        url: 'https://gemini.google.com/',
        name: 'Google Gemini',
        emoji: '💎'
    }
};

// Clase principal para manejar el flujo mejorado
class CommitPRGenerator {
    constructor() {
        this.logger = new Logger('info', true);
        this.gitUtils = null;
        this.config = null;
        this.aiClient = null;
        this.markdownGenerator = null;
    }

    // Inicializar componentes
    async initialize(repoPath = '.') {
        try {
            // Cambiar al directorio del repositorio
            const spinner = ora('Inicializando repositorio...').start();
            process.chdir(repoPath);
            
            // Inicializar componentes
            this.config = new Config(this.logger);
            this.gitUtils = new GitUtils(this.logger);
            this.aiClient = new AIClient(this.logger);
            this.markdownGenerator = new MarkdownGenerator(this.logger);
            
            // Verificar si es un repositorio Git válido
            if (!this.gitUtils.isGitRepository()) {
                spinner.fail('El directorio actual no es un repositorio Git válido');
                throw new Error('No es un repositorio Git válido');
            }
            
            spinner.succeed('Repositorio inicializado correctamente');
            return true;
        } catch (error) {
            this.logger.error('Error inicializando:', error);
            throw error;
        }
    }

    // Mostrar menú principal mejorado
    async showMainMenu() {
        console.log(chalk.cyan('\n🎯 ¿Qué proceso deseas realizar?'));
        
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Selecciona una opción:',
                choices: [
                    {
                        name: '🔄 Realizar múltiples procesos',
                        value: 'multiple',
                        short: 'Múltiples procesos'
                    },
                    {
                        name: '📝 Generar mensaje de Pull Request',
                        value: 'pr',
                        short: 'Pull Request'
                    },
                    {
                        name: '💬 Sugerir mensaje de commit',
                        value: 'commit',
                        short: 'Mensaje de commit'
                    },
                    {
                        name: '🌿 Sugerir nombre de rama',
                        value: 'branch',
                        short: 'Nombre de rama'
                    },
                    {
                        name: '🗑️ Eliminar historial de archivos generados',
                        value: 'cleanup',
                        short: 'Limpiar historial'
                    }
                ],
                default: 'multiple'
            }
        ]);

        return action;
    }

    // Seleccionar idioma
    async selectLanguage() {
        const { language } = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: '🌍 ¿En qué idioma deseas las respuestas?',
                choices: [
                    {
                        name: '🇺🇸 English (Inglés)',
                        value: 'en',
                        short: 'English'
                    },
                    {
                        name: '🇪🇸 Español',
                        value: 'es',
                        short: 'Español'
                    }
                ],
                default: 'en'
            }
        ]);

        return language;
    }

    // Seleccionar plataforma de IA
    async selectAIPlatform() {
        const { platform } = await inquirer.prompt([
            {
                type: 'list',
                name: 'platform',
                message: '🤖 Selecciona la plataforma de IA:',
                choices: [
                    {
                        name: '🤖 ChatGPT - OpenAI',
                        value: 'chatgpt',
                        short: 'ChatGPT'
                    },
                    {
                        name: '🧠 DeepSeek Chat',
                        value: 'deepseek',
                        short: 'DeepSeek'
                    },
                    {
                        name: '💎 Google Gemini',
                        value: 'gemini',
                        short: 'Gemini'
                    }
                ],
                default: 'deepseek'
            }
        ]);

        return platform;
    }

    // Seleccionar múltiples procesos
    async selectMultipleProcesses() {
        const { processes } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'processes',
                message: '🔄 Selecciona los procesos que deseas realizar:',
                choices: [
                    {
                        name: '📝 Generar mensaje de Pull Request',
                        value: 'pr',
                        checked: true
                    },
                    {
                        name: '💬 Sugerir mensaje de commit',
                        value: 'commit',
                        checked: true
                    },
                    {
                        name: '🌿 Sugerir nombre de rama',
                        value: 'branch',
                        checked: true
                    }
                ],
                validate: (answer) => {
                    if (answer.length < 1) {
                        return 'Debes seleccionar al menos un proceso';
                    }
                    return true;
                }
            }
        ]);

        return processes;
    }

    // Obtener información del repositorio y cambios
    async getRepositoryInfo() {
        const spinner = ora('Analizando cambios del repositorio...').start();
        
        try {
            // Obtener configuración Git
            const gitConfig = this.config.getGitConfig();
            
            // Validar cambios
            const changes = this.gitUtils.validateChanges(
                gitConfig.checkStagedChanges,
                gitConfig.checkUnstagedChanges
            );
            
            if (!changes.staged && !changes.unstaged) {
                throw new Error('No hay cambios detectados en el repositorio');
            }
            
            // Obtener patrones de exclusión
            const excludedPatterns = this.gitUtils.getExclusionPatterns(
                this.config.getDefaultExclusions()
            );
            
            // Obtener diff de Git
            const diff = this.gitUtils.getGitDiff(excludedPatterns, gitConfig.maxDiffSize);
            
            // Obtener información del repositorio
            const repoInfo = this.gitUtils.getRepositoryInfo();
            
            spinner.succeed(`Cambios detectados - Staged: ${changes.staged}, Unstaged: ${changes.unstaged}`);
            
            return {
                diff,
                repoInfo,
                changes
            };
        } catch (error) {
            spinner.fail('Error analizando repositorio');
            throw error;
        }
    }

    // Configurar idioma en la configuración
    setLanguage(language) {
        this.config.config.language = language;
    }

    // Generar contenido usando IA
    async generateContent(processType, diff, platform) {
        const spinner = ora(`Generando ${processType} con ${AI_PLATFORMS[platform].name}...`).start();
        
        try {
            // Obtener prompt según el tipo de proceso y idioma configurado
            const prompt = this.config.getPrompt(processType);
            const finalContent = `${prompt}\n\n${diff || '<No se detectaron cambios>'}`;
            
            // Generar contenido con IA
            const aiContent = await this.aiClient.generateContent(finalContent, platform, {
                prompt: processType,
                language: this.config.config.language || 'en'
            });
            
            spinner.succeed(`${processType} generado exitosamente`);
            
            return {
                content: aiContent,
                prompt: finalContent
            };
        } catch (error) {
            spinner.fail(`Error generando ${processType}`);
            throw error;
        }
    }

    // Generar nombre de archivo único para evitar sobreescritura
    async generateUniqueFileName(outputDir, processType, timestamp) {
        let counter = 1;
        let fileName = `${processType}-${timestamp}.md`;
        
        while (true) {
            const filePath = path.join(outputDir, fileName);
            try {
                await fs.access(filePath);
                // El archivo existe, incrementar contador
                counter++;
                fileName = `${processType}-${timestamp}-${counter}.md`;
            } catch (error) {
                // El archivo no existe, usar este nombre
                break;
            }
        }
        
        return fileName;
    }

    // Guardar múltiples procesos en un solo archivo
    async saveMultipleToHistory(processes, contents, platform) {
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Crear carpeta para archivos generados
        const outputDir = path.join(process.cwd(), 'generated-files');
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (error) {
            // La carpeta ya existe, continuar
        }
        
        // Generar nombre de archivo único para múltiples procesos
        const fileName = await this.generateUniqueFileName(outputDir, 'multiple', timestamp);
        const filePath = path.join(outputDir, fileName);
        
        try {
        // Crear contenido combinado con orden específico
        const orderedContent = [];
        
        // Ordenar procesos: branch, commit, pr
        const processOrder = ['branch', 'commit', 'pr'];
        const orderedProcesses = [];
        const orderedContents = [];
        
        // Reorganizar según el orden deseado
        processOrder.forEach(orderType => {
            const index = processes.indexOf(orderType);
            if (index !== -1) {
                orderedProcesses.push(processes[index]);
                orderedContents.push(contents[index]);
            }
        });
        
        // Crear contenido combinado
        const combinedContent = orderedContents.map((content, index) => {
            const processType = orderedProcesses[index];
            const title = processType.charAt(0).toUpperCase() + processType.slice(1);
            return `# ${title}\n\n${content}`;
        }).join('\n\n--------\n\n');
            
            const fileContent = `${combinedContent}`;

            // Guardar archivo
            await fs.writeFile(filePath, fileContent, 'utf8');
            
            return {
                fileName,
                filePath,
                success: true
            };
        } catch (error) {
            this.logger.error('Error guardando archivo múltiple:', error);
            return {
                fileName,
                filePath,
                success: false,
                error: error.message
            };
        }
    }

    // Abrir archivo generado automáticamente
    async openGeneratedFile(filePath) {
        try {
            const spinner = ora('Abriendo archivo generado...').start();
            await open(filePath);
            spinner.succeed('Archivo abierto exitosamente');
            this.logger.debug(`Archivo abierto: ${filePath}`);
        } catch (error) {
            console.log(chalk.yellow(`\n⚠️  No se pudo abrir el archivo automáticamente: ${error.message}`));
            console.log(chalk.cyan(`📁 Puedes abrirlo manualmente desde: ${filePath}`));
            this.logger.error('Error abriendo archivo:', error);
        }
    }

    // Guardar resultado en archivo markdown con historial
    async saveToHistory(processType, content, platform) {
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Crear carpeta para archivos generados
        const outputDir = path.join(process.cwd(), 'generated-files');
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (error) {
            // La carpeta ya existe, continuar
        }
        
        // Generar nombre de archivo único
        const fileName = await this.generateUniqueFileName(outputDir, processType, timestamp);
        const filePath = path.join(outputDir, fileName);
        
        try {
            // Crear contenido del archivo
            const fileContent = `${content}`;

            // Guardar archivo
            await fs.writeFile(filePath, fileContent, 'utf8');
            
            return {
                fileName,
                filePath,
                success: true
            };
        } catch (error) {
            this.logger.error('Error guardando archivo:', error);
            return {
                fileName,
                filePath,
                success: false,
                error: error.message
            };
        }
    }

    // Procesar un tipo específico
    async processSingle(processType, platform) {
        try {
            // Obtener información del repositorio
            const { diff } = await this.getRepositoryInfo();
            
            // Generar contenido
            const { content } = await this.generateContent(processType, diff, platform);
            
            // Guardar en historial
            const result = await this.saveToHistory(processType, content, platform);
            
            if (result.success) {
                console.log(chalk.green(`\n✅ ${processType} generado y guardado exitosamente`));
                console.log(chalk.cyan(`📁 Archivo: ${result.fileName}`));
                console.log(chalk.gray(`📍 Ruta: ${result.filePath}`));
                
                // Abrir archivo generado
                await this.openGeneratedFile(result.filePath);
            } else {
                console.log(chalk.red(`\n❌ Error guardando archivo: ${result.error}`));
            }
            
            return result;
        } catch (error) {
            console.log(chalk.red(`\n❌ Error procesando ${processType}: ${error.message}`));
            throw error;
        }
    }

    // Limpiar historial de archivos generados
    async cleanupHistory() {
        const outputDir = path.join(process.cwd(), 'generated-files');
        
        try {
            // Verificar si la carpeta existe
            await fs.access(outputDir);
            
            // Listar archivos en la carpeta
            const files = await fs.readdir(outputDir);
            const markdownFiles = files.filter(file => file.endsWith('.md'));
            
            if (markdownFiles.length === 0) {
                console.log(chalk.yellow('\n📁 No hay archivos de historial para eliminar'));
                return;
            }
            
            console.log(chalk.cyan(`\n🗑️ Archivos encontrados en el historial (${markdownFiles.length}):`));
            markdownFiles.forEach(file => {
                console.log(chalk.gray(`  - ${file}`));
            });
            
            // Confirmar eliminación
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: '¿Estás seguro de que quieres eliminar todos estos archivos?',
                    default: false
                }
            ]);
            
            if (confirm) {
                const spinner = ora('Eliminando archivos de historial...').start();
                
                // Eliminar cada archivo
                for (const file of markdownFiles) {
                    await fs.unlink(path.join(outputDir, file));
                }
                
                spinner.succeed(`${markdownFiles.length} archivos eliminados exitosamente`);
                console.log(chalk.green('\n✅ Historial limpiado completamente'));
            } else {
                console.log(chalk.yellow('\n❌ Operación cancelada'));
            }
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(chalk.yellow('\n📁 No existe carpeta de historial'));
            } else {
                console.log(chalk.red(`\n❌ Error limpiando historial: ${error.message}`));
            }
        }
    }

    // Procesar múltiples tipos
    async processMultiple(processes, platform) {
        const results = [];
        const contents = [];
        
        console.log(chalk.cyan(`\n🔄 Procesando ${processes.length} procesos...`));
        
        // Generar contenido para todos los procesos
        for (const processType of processes) {
            try {
                console.log(chalk.yellow(`\n⏳ Procesando: ${processType}`));
                const { diff } = await this.getRepositoryInfo();
                const { content } = await this.generateContent(processType, diff, platform);
                contents.push(content);
                results.push({ processType, success: true });
            } catch (error) {
                console.log(chalk.red(`❌ Error en ${processType}: ${error.message}`));
                results.push({ processType, success: false, error: error.message });
            }
        }
        
        // Guardar todos los contenidos en un solo archivo
        if (contents.length > 0) {
            const successfulProcesses = processes.filter((_, index) => results[index].success);
            const successfulContents = contents.filter((_, index) => results[index].success);
            
            const result = await this.saveMultipleToHistory(successfulProcesses, successfulContents, platform);
            
            if (result.success) {
                console.log(chalk.green(`\n✅ Archivo múltiple generado y guardado exitosamente`));
                console.log(chalk.cyan(`📁 Archivo: ${result.fileName}`));
                console.log(chalk.gray(`📍 Ruta: ${result.filePath}`));
                
                // Abrir archivo generado
                await this.openGeneratedFile(result.filePath);
            } else {
                console.log(chalk.red(`\n❌ Error guardando archivo múltiple: ${result.error}`));
            }
        }
        
        // Mostrar resumen
        console.log(chalk.cyan('\n📊 Resumen de resultados:'));
        results.forEach(result => {
            if (result.success) {
                console.log(chalk.green(`✅ ${result.processType}: Procesado exitosamente`));
            } else {
                console.log(chalk.red(`❌ ${result.processType}: ${result.error}`));
            }
        });
        
        return results;
    }

    // Flujo principal
    async run() {
        try {
            // Inicializar
            await this.initialize();
            
            // Mostrar menú principal
            const action = await this.showMainMenu();
            
            // Si es cleanup, no necesitamos seleccionar plataforma de IA
            if (action === 'cleanup') {
                // Limpiar historial
                await this.cleanupHistory();
                return;
            }
            
            // Seleccionar idioma
            const language = await this.selectLanguage();
            this.setLanguage(language);
            
            // Seleccionar plataforma solo si no es cleanup
            const platform = await this.selectAIPlatform();
            
            console.log(chalk.cyan(`\n🚀 Iniciando proceso con ${AI_PLATFORMS[platform].emoji} ${AI_PLATFORMS[platform].name}`));
            
            let results = [];
            
            if (action === 'multiple') {
                // Procesar múltiples tipos
                const processes = await this.selectMultipleProcesses();
                results = await this.processMultiple(processes, platform);
            } else {
                // Procesar tipo único
                const result = await this.processSingle(action, platform);
                results = [result];
            }
            
            // Mostrar mensaje final
            const successCount = results.filter(r => r.success).length;
            const totalCount = results.length;
            
            console.log(chalk.green(`\n🎉 Proceso completado! ${successCount}/${totalCount} archivos generados exitosamente`));
            console.log(chalk.cyan('\n💡 Los archivos se han guardado en la carpeta "generated-files" como historial'));
            
        } catch (error) {
            console.log(chalk.red(`\n❌ Error inesperado: ${error.message}`));
            this.logger.error('Error inesperado:', error);
            process.exit(1);
        }
    }
}

// Función principal
async function main() {
    const program = new Command();
    
    program
        .name(PACKAGE_INFO.name)
        .description(PACKAGE_INFO.description)
        .version(PACKAGE_INFO.version)
        .argument('[path]', 'Ruta al repositorio Git', '.')
        .option('-v, --verbose', 'Mostrar información detallada de debugging')
        .parse();

    const options = program.opts();
    const [repoPath] = program.args;

    // Configurar logger
    const logger = new Logger(options.verbose ? 'debug' : 'info', true);

    try {
        const generator = new CommitPRGenerator();
        generator.logger = logger;
        await generator.run();
    } catch (error) {
        console.error(chalk.red('Error fatal:'), error);
        process.exit(1);
    }
}

// Ejecutar solo si es el módulo principal
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1]?.endsWith('main.mjs');

if (isMainModule) {
    main().catch(error => {
        console.error(chalk.red('Error fatal:'), error);
        process.exit(1);
    });
}

export { CommitPRGenerator };
