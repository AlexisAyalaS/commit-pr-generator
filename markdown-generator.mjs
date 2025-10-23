// markdown-generator.mjs
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import Logger from './logger.mjs';

export class MarkdownGenerator {
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Genera un archivo markdown con el contenido de la IA
     */
    async generateMarkdownFile(content, promptType, platform, options = {}) {
        const timestamp = new Date().toISOString().split('T')[0];
        const time = new Date().toISOString().split('T')[1].split('.')[0];
        
        // Determinar nombre del archivo basado en el tipo de prompt
        const fileName = this.generateFileName(promptType, timestamp);
        const filePath = join(process.cwd(), fileName);

        // Crear contenido del archivo con metadata
        const markdownContent = this.formatMarkdownContent(content, promptType, platform, timestamp, time);

        const spinner = ora(`Generando archivo markdown: ${fileName}`).start();

        try {
            // Verificar si el archivo ya existe
            if (existsSync(filePath) && !options.overwrite) {
                spinner.warn(`Archivo ${fileName} ya existe`);
                const newFileName = this.generateUniqueFileName(promptType, timestamp, time);
                const newFilePath = join(process.cwd(), newFileName);
                
                writeFileSync(newFilePath, markdownContent, 'utf-8');
                spinner.succeed(`Archivo generado: ${newFileName}`);
                
                this.logger.debug(`Archivo generado: ${newFileName}`);
                return { filePath: newFilePath, fileName: newFileName };
            }

            writeFileSync(filePath, markdownContent, 'utf-8');
            spinner.succeed(`Archivo generado: ${fileName}`);
            
            this.logger.debug(`Archivo generado: ${fileName}`);
            return { filePath, fileName };

        } catch (error) {
            spinner.fail(`Error generando archivo: ${error.message}`);
            this.logger.error('Error generando archivo markdown:', error);
            throw error;
        }
    }

    /**
     * Genera el nombre del archivo basado en el tipo de prompt
     */
    generateFileName(promptType, timestamp) {
        const typeNames = {
            'default': 'pull-request-description',
            'commit': 'commit-message',
            'detailed': 'detailed-pr-description',
            'branch-name': 'branch-name-suggestions'
        };

        const baseName = typeNames[promptType] || 'generated-content';
        return `${baseName}-${timestamp}.md`;
    }

    /**
     * Genera un nombre único si el archivo ya existe
     */
    generateUniqueFileName(promptType, timestamp, time) {
        const timeStr = time.replace(/:/g, '-');
        const baseName = this.generateFileName(promptType, timestamp).replace('.md', '');
        return `${baseName}-${timeStr}.md`;
    }

    /**
     * Formatea el contenido markdown con metadata
     */
    formatMarkdownContent(content, promptType, platform, date, time) {
        const typeNames = {
            'default': 'Pull Request Description',
            'commit': 'Commit Message',
            'detailed': 'Detailed Pull Request Description',
            'branch-name': 'Branch Name Suggestions'
        };

        const title = typeNames[promptType] || 'Generated Content';
        
        return `# ${title}

> **Generado automáticamente** el ${date} a las ${time}  
> **Plataforma de IA:** ${platform}  
> **Herramienta:** commit-pr-generator v0.1.0

---

${content}

---

## 📝 Notas
- Este archivo fue generado automáticamente por commit-pr-generator
- Revisa y ajusta el contenido según sea necesario
- Puedes usar este contenido directamente en tu commit o pull request

## 🔗 Enlaces útiles
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branch Naming Conventions](https://github.com/agis/git-style-guide)
- [Pull Request Best Practices](https://github.com/todogroup/opencodeofconduct)

---
*Generado con ❤️ por commit-pr-generator*`;
    }

    /**
     * Muestra un resumen del archivo generado
     */
    displayFileSummary(fileName, filePath, promptType) {
        console.log(chalk.green('\n📄 Archivo markdown generado exitosamente!'));
        console.log(chalk.cyan('\n📋 Resumen:'));
        console.log(chalk.gray(`Archivo: ${fileName}`));
        console.log(chalk.gray(`Ubicación: ${filePath}`));
        console.log(chalk.gray(`Tipo: ${this.getTypeDescription(promptType)}`));
        
        console.log(chalk.yellow('\n💡 Próximos pasos:'));
        console.log(chalk.gray('1. Revisa el contenido del archivo'));
        console.log(chalk.gray('2. Ajusta según sea necesario'));
        console.log(chalk.gray('3. Usa el contenido para tu commit o PR'));
        
        if (promptType === 'branch-name') {
            console.log(chalk.blue('\n🌿 Para crear una nueva rama:'));
            console.log(chalk.gray('git checkout -b nombre-sugerido'));
        } else if (promptType === 'commit') {
            console.log(chalk.blue('\n💬 Para hacer commit:'));
            console.log(chalk.gray('git commit -m "tu mensaje aquí"'));
        }
    }

    /**
     * Obtiene la descripción del tipo de contenido
     */
    getTypeDescription(promptType) {
        const descriptions = {
            'default': 'Descripción de Pull Request',
            'commit': 'Mensaje de Commit',
            'detailed': 'Descripción Detallada de PR',
            'branch-name': 'Sugerencias de Nombres de Rama'
        };
        
        return descriptions[promptType] || 'Contenido Generado';
    }

    /**
     * Lista archivos markdown generados recientemente
     */
    listGeneratedFiles() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            const files = fs.readdirSync(process.cwd())
                .filter(file => file.endsWith('.md') && file.includes('-202'))
                .sort()
                .reverse()
                .slice(0, 10); // Últimos 10 archivos

            if (files.length === 0) {
                console.log(chalk.yellow('No se encontraron archivos markdown generados recientemente'));
                return;
            }

            console.log(chalk.cyan('\n📁 Archivos markdown generados recientemente:'));
            files.forEach((file, index) => {
                const filePath = path.join(process.cwd(), file);
                const stats = fs.statSync(filePath);
                const date = stats.mtime.toLocaleDateString();
                const time = stats.mtime.toLocaleTimeString();
                
                console.log(chalk.gray(`${index + 1}. ${file} (${date} ${time})`));
            });

        } catch (error) {
            this.logger.error('Error listando archivos:', error);
            console.log(chalk.red('Error listando archivos generados'));
        }
    }
}
