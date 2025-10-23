#!/usr/bin/env node
// setup.mjs - Script de configuración inicial para commit-pr-generator
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Información del paquete
const PACKAGE_INFO = {
    name: 'commit-pr-generator',
    version: '1.0.0',
    description: 'CLI tool that automates commit messages and pull request descriptions using AI'
};

console.log(`
╔══════════════════════════════════════════════════╗
║          COMMIT & PR GENERATOR SETUP             ║
╠══════════════════════════════════════════════════╣
║ Configurando ${PACKAGE_INFO.name} v${PACKAGE_INFO.version}... ║
╚══════════════════════════════════════════════════╝
`);

async function setup() {
    try {
        console.log('🔧 Configurando commit-pr-generator...\n');

        // 1. Crear directorio generated-files si no existe
        const generatedDir = path.join(__dirname, 'generated-files');
        try {
            await fs.access(generatedDir);
            console.log('✅ Directorio generated-files ya existe');
        } catch {
            await fs.mkdir(generatedDir, { recursive: true });
            console.log('✅ Directorio generated-files creado');
        }

        // 2. Crear archivo de configuración si no existe
        const configFile = path.join(__dirname, 'commit-pr-config.json');
        const exampleConfigFile = path.join(__dirname, 'commit-pr-config.example.json');
        
        try {
            await fs.access(configFile);
            console.log('✅ Archivo commit-pr-config.json ya existe');
        } catch {
            try {
                await fs.access(exampleConfigFile);
                await fs.copyFile(exampleConfigFile, configFile);
                console.log('✅ Archivo commit-pr-config.json creado desde el ejemplo');
            } catch {
                console.log('⚠️  No se encontró commit-pr-config.example.json');
            }
        }

        // 3. Verificar que estamos en un repositorio Git
        const gitDir = path.join(process.cwd(), '.git');
        try {
            await fs.access(gitDir);
            console.log('✅ Repositorio Git detectado');
        } catch {
            console.log('⚠️  No se detectó un repositorio Git en el directorio actual');
            console.log('   Para usar commit-pr-generator, ejecuta desde un repositorio Git');
        }

        // 4. Verificar dependencias de Node.js
        console.log('\n📦 Verificando dependencias...');
        
        const requiredDeps = [
            'clipboardy',
            'open', 
            'commander',
            'chalk',
            'ora',
            'inquirer'
        ];

        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        
        let missingDeps = [];
        for (const dep of requiredDeps) {
            if (!packageJson.dependencies[dep]) {
                missingDeps.push(dep);
            }
        }

        if (missingDeps.length === 0) {
            console.log('✅ Todas las dependencias están configuradas');
        } else {
            console.log('❌ Dependencias faltantes:', missingDeps.join(', '));
            console.log('   Ejecuta: npm install');
        }

        // 5. Crear archivo .gitignore si no existe
        const gitignorePath = path.join(__dirname, '.gitignore');
        try {
            await fs.access(gitignorePath);
            console.log('✅ Archivo .gitignore ya existe');
        } catch {
            const gitignoreContent = `# Dependencias
node_modules/
package-lock.json
yarn.lock

# Archivos generados
generated-files/
*.md

# Logs
*.log
npm-debug.log*

# Archivos temporales
.DS_Store
.env
.env.*
*.tmp

# Coverage
coverage/

# IDE
.vscode/
.idea/
`;
            await fs.writeFile(gitignorePath, gitignoreContent);
            console.log('✅ Archivo .gitignore creado');
        }

        console.log('\n🎉 ¡Configuración completada!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Instalar dependencias: npm install');
        console.log('2. Ejecutar en modo interactivo: git-ai');
        console.log('3. O usar directamente: node main.mjs');
        console.log('\n💡 Para más información, consulta el README.md');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
        process.exit(1);
    }
}

// Ejecutar setup
setup();
