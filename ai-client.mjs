// ai-client.mjs
import chalk from 'chalk';
import ora from 'ora';
import Logger from './logger.mjs';

export class AIClient {
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Genera contenido usando diferentes servicios de IA
     */
    async generateContent(prompt, platform, options = {}) {
        const spinner = ora(`Generando contenido con ${platform}...`).start();
        
        try {
            let response;
            
            switch (platform.toLowerCase()) {
                case 'chatgpt':
                    response = await this.callChatGPT(prompt, options);
                    break;
                case 'deepseek':
                    response = await this.callDeepSeek(prompt, options);
                    break;
                case 'gemini':
                    response = await this.callGemini(prompt, options);
                    break;
                default:
                    throw new Error(`Plataforma no soportada: ${platform}`);
            }

            spinner.succeed(`Contenido generado exitosamente con ${platform}`);
            this.logger.debug('Respuesta de IA:', response);
            
            return response;
        } catch (error) {
            spinner.fail(`Error generando contenido con ${platform}`);
            this.logger.error(`Error en ${platform}:`, error.message);
            throw error;
        }
    }

    /**
     * Simula llamada a ChatGPT (requiere API key en producción)
     */
    async callChatGPT(prompt, options) {
        // En una implementación real, aquí harías la llamada a la API de OpenAI
        // Por ahora, simulamos una respuesta basada en el prompt
        
        this.logger.debug('Simulando llamada a ChatGPT');
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return this.generateSimulatedResponse(prompt, 'ChatGPT', options);
    }

    /**
     * Simula llamada a DeepSeek (requiere API key en producción)
     */
    async callDeepSeek(prompt, options) {
        this.logger.debug('Simulando llamada a DeepSeek');
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return this.generateSimulatedResponse(prompt, 'DeepSeek', options);
    }

    /**
     * Simula llamada a Gemini (requiere API key en producción)
     */
    async callGemini(prompt, options) {
        this.logger.debug('Simulando llamada a Gemini');
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        return this.generateSimulatedResponse(prompt, 'Gemini', options);
    }

    /**
     * Genera una respuesta simulada basada en el tipo de prompt
     */
    generateSimulatedResponse(prompt, platform, options = {}) {
        const timestamp = new Date().toISOString();
        
        // Usar el tipo de prompt pasado en options si está disponible
        const promptType = options.prompt || this.detectPromptType(prompt);
        
        // Detectar idioma del prompt o usar el idioma pasado en options
        const language = options.language || this.detectLanguage(prompt);
        
        switch (promptType) {
            case 'branch':
            case 'branch-name':
                return this.generateBranchNameSuggestions(platform, language);
            case 'commit':
                return this.generateCommitMessage(platform, language);
            case 'detailed':
                return this.generateDetailedPR(platform, language);
            case 'pr':
            case 'default':
            default:
                return this.generateStandardPR(platform, language);
        }
    }

    /**
     * Detecta el idioma del prompt
     */
    detectLanguage(prompt) {
        // Detectar si el prompt está en español
        if (prompt.includes('Por favor') || prompt.includes('Git Diff de cambios') || 
            prompt.includes('descripción') || prompt.includes('mensaje de commit') ||
            prompt.includes('nombres de rama') || prompt.includes('siguiendo')) {
            return 'es';
        }
        return 'en';
    }

    /**
     * Detecta el tipo de prompt basado en el contenido (fallback)
     */
    detectPromptType(prompt) {
        if (prompt.includes('branch names') || prompt.includes('nombres de rama')) {
            return 'branch';
        } else if (prompt.includes('commit message') || prompt.includes('mensaje de commit')) {
            return 'commit';
        } else if (prompt.includes('comprehensive') || prompt.includes('detallada')) {
            return 'detailed';
        } else {
            return 'pr';
        }
    }

    /**
     * Genera sugerencias de nombres de rama simuladas
     */
    generateBranchNameSuggestions(platform, language = 'en') {
        const suggestions = [
            'feat/interactive-mode-implementation',
            'feat/ai-integration-system',
            'feat/markdown-generation',
            'feat/automated-content-creation',
            'feat/cli-enhancement'
        ];

        // Seleccionar la mejor recomendación
        const bestSuggestion = suggestions[0]; // feat/interactive-mode-implementation

        return bestSuggestion;
    }

    /**
     * Genera mensaje de commit simulado
     */
    generateCommitMessage(platform, language = 'en') {
        const commitMessages = {
            en: [
                'feat: implement improved interactive mode',
                'feat: add automatic history system',
                'refactor: simplify user flow',
                'feat: support for multiple processes',
                'docs: update documentation in English'
            ],
            es: [
                'feat: implementar modo interactivo mejorado',
                'feat: agregar sistema de historial automático',
                'refactor: simplificar flujo de usuario',
                'feat: soporte para múltiples procesos',
                'docs: actualizar documentación en español'
            ]
        };

        const messages = commitMessages[language] || commitMessages.en;
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return selectedMessage;
    }

    /**
     * Genera descripción detallada de PR simulada
     */
    generateDetailedPR(platform, language = 'en') {
        if (language === 'es') {
            return `# 🚀 Implementar Modo Interactivo e Integración con IA

## 📋 Resumen
Este PR introduce un modo interactivo completo a la herramienta commit-pr-generator, junto con capacidades de generación de contenido con IA.

## ✨ Características Agregadas
- **CLI Interactivo**: Sistema de menú guiado para seleccionar acciones
- **Integración con IA**: Generación directa de contenido usando múltiples plataformas de IA
- **Múltiples Tipos de Prompt**: Soporte para descripciones de PR, mensajes de commit y sugerencias de nombres de rama
- **Generación de Markdown**: Creación automática de archivos con contenido generado por IA
- **UX Mejorada**: Flujo de trabajo simplificado con pasos de confirmación

## 🔧 Implementación Técnica
- Agregada clase \`InteractiveMode\` para gestión de menús
- Implementado \`AIClient\` para comunicación con API
- Creado sistema de plantillas para diferentes tipos de contenido
- Mejorado CLI con nuevas opciones y validación

## 🧪 Testing
- [x] Funcionalidad del modo interactivo
- [x] Generación de contenido con IA
- [x] Creación y formateo de archivos
- [x] Manejo de errores y validación

## 📸 Screenshots
![Modo Interactivo](https://example.com/interactive-mode.png)

## 🔄 Cambios que Rompen Compatibilidad
Ninguno - esta es una mejora compatible con versiones anteriores.

## 📚 Documentación
- README actualizado con nuevas características
- Agregados ejemplos para toda la nueva funcionalidad
- Creada guía completa de uso

---
*Generado por commit-pr-generator con ${platform}*`;
        }

        return `# 🚀 Implement Interactive Mode and AI Integration

## 📋 Overview
This PR introduces a comprehensive interactive mode to the commit-pr-generator tool, along with AI-powered content generation capabilities.

## ✨ Features Added
- **Interactive CLI**: Guided menu system for selecting actions
- **AI Integration**: Direct content generation using multiple AI platforms
- **Multiple Prompt Types**: Support for PR descriptions, commit messages, and branch name suggestions
- **Markdown Generation**: Automatic file creation with AI-generated content
- **Enhanced UX**: Streamlined workflow with confirmation steps

## 🔧 Technical Implementation
- Added \`InteractiveMode\` class for menu management
- Implemented \`AIClient\` for API communication
- Created template system for different content types
- Enhanced CLI with new options and validation

## 🧪 Testing
- [x] Interactive mode functionality
- [x] AI content generation
- [x] File creation and formatting
- [x] Error handling and validation

## 📸 Screenshots
![Interactive Mode](https://example.com/interactive-mode.png)

## 🔄 Breaking Changes
None - this is a backward-compatible enhancement.

## 📚 Documentation
- Updated README with new features
- Added examples for all new functionality
- Created comprehensive usage guide

---
*Generated by commit-pr-generator with ${platform}*`;
    }

    /**
     * Genera descripción estándar de PR simulada
     */
    generateStandardPR(platform, language = 'en') {
        if (language === 'es') {
            return `# 🚀 Mejoras en el flujo del proyecto

## 📋 Resumen
Se ha mejorado significativamente el flujo del proyecto para hacerlo más intuitivo y fácil de usar. Los cambios principales incluyen:

## ✨ Cambios implementados
- **Nuevo archivo principal (main.mjs)**: Flujo simplificado y más claro
- **Sistema de historial**: Los resultados se guardan automáticamente en archivos markdown
- **Menú interactivo mejorado**: Opciones más claras y fáciles de entender
- **Soporte para múltiples procesos**: Permite ejecutar varios procesos en una sola sesión
- **Compatibilidad legacy**: Mantiene el comportamiento anterior para usuarios existentes

## 🔧 Archivos modificados
- main.mjs - Nuevo archivo principal con flujo mejorado
- interactive.mjs - Menú interactivo actualizado
- commit-pr-generator.mjs - Actualizado para usar el nuevo flujo
- package.json - Scripts actualizados
- README.md - Documentación actualizada en español

## 🎯 Beneficios
- **Flujo más claro**: El usuario puede elegir fácilmente qué proceso realizar
- **Historial automático**: Todos los resultados se guardan como archivos markdown
- **Mejor experiencia**: Interfaz más intuitiva y fácil de usar
- **Flexibilidad**: Soporte para procesos individuales o múltiples

## 🎬 Demo
### Cómo usar el nuevo sistema:

1. **Ejecutar el comando**:
   \`\`\`bash
   commit-pr-generator
   \`\`\`

2. **Seleccionar proceso**:
   - 📝 Generar mensaje de Pull Request
   - 💬 Sugerir mensaje de commit
   - 🌿 Sugerir nombre de rama
   - 🔄 Realizar múltiples procesos

3. **Elegir plataforma de IA**:
   - 🤖 ChatGPT
   - 🧠 DeepSeek Chat
   - 💎 Google Gemini

4. **Resultado**: El archivo se genera automáticamente y se abre en tu editor

### Ejemplo de uso:
\`\`\`bash
# Modo interactivo (recomendado)
commit-pr-generator

# Modo legacy
commit-pr-generator --legacy
\`\`\`

`;
        }

        return `# 🚀 Project Flow Improvements

## 📋 Summary
The project flow has been significantly improved to make it more intuitive and user-friendly. The main changes include:

## ✨ Implemented Changes
- **New main file (main.mjs)**: Simplified and clearer flow
- **History system**: Results are automatically saved in markdown files
- **Improved interactive menu**: Clearer and easier to understand options
- **Multiple processes support**: Allows running several processes in a single session
- **Legacy compatibility**: Maintains previous behavior for existing users

## 🔧 Modified Files
- main.mjs - New main file with improved flow
- interactive.mjs - Updated interactive menu
- commit-pr-generator.mjs - Updated to use new flow
- package.json - Updated scripts
- README.md - Updated documentation in English

## 🎯 Benefits
- **Clearer flow**: Users can easily choose which process to perform
- **Automatic history**: All results are saved as markdown files
- **Better experience**: More intuitive and user-friendly interface
- **Flexibility**: Support for individual or multiple processes

## 🎬 Demo
### How to use the new system:

1. **Run the command**:
   \`\`\`bash
   commit-pr-generator
   \`\`\`

2. **Select process**:
   - 📝 Generate Pull Request message
   - 💬 Suggest commit message
   - 🌿 Suggest branch name
   - 🔄 Perform multiple processes

3. **Choose AI platform**:
   - 🤖 ChatGPT
   - 🧠 DeepSeek Chat
   - 💎 Google Gemini

4. **Result**: The file is automatically generated and opened in your editor

### Usage example:
\`\`\`bash
# Interactive mode (recommended)
commit-pr-generator

# Legacy mode
commit-pr-generator --legacy
\`\`\`

`;
    }
}
