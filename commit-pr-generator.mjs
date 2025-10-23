#!/usr/bin/env node
// commit-pr-generator.mjs - Archivo principal simplificado
import { Command } from 'commander';
import chalk from 'chalk';
import Logger from './logger.mjs';
import { CommitPRGenerator } from './main.mjs';

// Información del paquete
const PACKAGE_INFO = {
    name: 'commit-pr-generator',
    version: '1.0.0',
    author: 'Alexis Ayala Solorio <lex.solorio15@gmail.com>',
    description: 'CLI tool that automates commit messages and pull request descriptions using AI'
};


// Función principal simplificada
async function main() {
    const program = new Command();
    
    program
        .name(PACKAGE_INFO.name)
        .description(PACKAGE_INFO.description)
        .version(PACKAGE_INFO.version)
        .option('-v, --verbose', 'Mostrar información detallada de debugging')
        .parse();

    const options = program.opts();

    // Inicializar logger con configuración
    const logger = new Logger(
        options.verbose ? 'debug' : 'info',
        true
    );

    try {
        // Modo interactivo (comportamiento por defecto)
        console.log(chalk.cyan('\n🚀 Iniciando Commit & PR Generator'));
        const generator = new CommitPRGenerator();
        generator.logger = logger;
        await generator.run();

    } catch (error) {
        logger.error('Error inesperado:', error);
        console.log(chalk.red(`\n❌ Error inesperado: ${error.message}`));
        if (options.verbose) {
            console.log(chalk.gray('\nStack trace:'));
            console.log(chalk.gray(error.stack));
        }
        process.exit(1);
    }
}


// Ejecutar solo si es el módulo principal
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1].endsWith('commit-pr-generator.mjs');

if (isMainModule) {
    main().catch(error => {
        console.error(chalk.red('Error fatal:'), error);
        process.exit(1);
    });
}