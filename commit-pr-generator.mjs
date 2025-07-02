#!/usr/bin/env node
// pr.mjs
import {execSync} from 'child_process';
import open from 'open';
import clipboardy from 'clipboardy';
import {existsSync, readFileSync} from 'fs';

// Configuración de las plataformas de IA disponibles
const AI_PLATFORMS = {
    chatgpt: {
        url: 'https://chatgpt.com/',
        name: 'ChatGPT'
    },
    deepseek: {
        url: 'https://chat.deepseek.com',
        name: 'DeepSeek Chat'
    },
    gemini: {
        url: 'https://gemini.google.com/',
        name: 'Google Gemini'
    }
};

// Mostrar información del paquete con mejor formato
console.log(`
╔══════════════════════════════════════════════════╗
║          COMMIT & PR GENERATOR TOOL              ║
╠══════════════════════════════════════════════════╣
║ Author: Alexis Ayala <lex.solorio15@gmail.com>   ║
║ Version: 0.0.6                                   ║
╚══════════════════════════════════════════════════╝

 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗   ██████╗ ██████╗        ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗ 
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝   ██╔══██╗██╔══██╗      ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║█████╗██████╔╝██████╔╝█████╗██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║╚════╝██╔═══╝ ██╔══██╗╚════╝██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║      ██║     ██║  ██║      ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝      ╚═╝     ╚═╝  ╚═╝       ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

`);

const PROMPT = `
Please draft markdown for a pull request with the following requirements:

1. Title: Clear, concise description of changes with relevant emoji
2. Body:
   - Detailed description of changes
   - Technical implementation notes if relevant
   - Demo section for images/videos (if applicable)
3. Format: Use Conventional Commits standard
4. Exclude: 'Related Issues' or 'Checklist' sections

Git Diff of changes:
`;

// Obtener argumentos
const repoPath = process.argv[2] || process.cwd();
const aiPlatform = process.argv[3]?.toLowerCase() || 'chatgpt';

// Validar plataforma de IA con mensaje más amigable
if (!AI_PLATFORMS[aiPlatform]) {
    console.error(`❌ Error: Unsupported AI platform '${aiPlatform}'`);
    console.log(`Please choose one of these available platforms:\n${Object.keys(AI_PLATFORMS).map(p => `- ${p}`).join('\n')}`);
    process.exit(1);
}

// Cambiar al directorio del repositorio con mejor feedback
console.log(`\n🔍 Analyzing repository at: ${repoPath}`);
try {
    process.chdir(repoPath);
    console.log(`✓ Successfully accessed repository directory`);
} catch (error) {
    console.error(`❌ Error changing directory: ${error.message}`);
    console.log(`Please verify the path exists and you have proper permissions.`);
    process.exit(1);
}

// Verificar si es un repositorio Git con mejor mensaje
try {
    execSync('git rev-parse --is-inside-work-tree', {stdio: 'ignore'});
    console.log(`✓ Valid Git repository detected`);
} catch {
    console.error(`❌ Error: Current directory is not a Git repository`);
    console.log(`Please run this command in a directory with a .git folder`);
    process.exit(1);
}

// Leer .prignore (o .gitignore si no existe) con mejor feedback
const ignoreFile = '.prignore';
let excludedPatterns = [
    'package-lock.json',
    'node_modules',
    '.env',
    'coverage',
    'dist',
    'yarn.lock'
]; // Valores por defecto

if (existsSync(ignoreFile)) {
    console.log(`✓ Found .prignore file - using custom exclusion patterns`);
    const ignoreContent = readFileSync(ignoreFile, 'utf-8');
    excludedPatterns = ignoreContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
} else {
    console.log(`ℹ️ No .prignore file found - using default exclusions`);
}

console.log(`🗑️ Excluding files matching patterns:\n${excludedPatterns.map(p => `  - ${p}`).join('\n')}`);

// Construir comando git diff
const isWindows = process.platform === 'win32';
const excludePrefix = isWindows ? ':!' : ':(exclude)';
const diffExcludes = excludedPatterns
    .map(pattern => `${excludePrefix}${pattern}`)
    .join(' ');

const diffCommand = `git diff -- . ${diffExcludes}`;

// Capturar el diff de Git con mejor manejo de errores
console.log(`\n📊 Capturing git diff of your changes...`);
let DIFF;
try {
    DIFF = execSync(diffCommand, {encoding: 'utf-8'});
    if (!DIFF.trim()) {
        console.log('ℹ️ No changes detected in tracked files (empty diff)');
        console.log('Make sure you have staged or made changes to files not in your exclude list');
    }
} catch (error) {
    console.error(`❌ Error executing git diff: ${error.message}`);
    DIFF = '';
}

// Preparar el contenido final
const FINAL_CONTENT = `${PROMPT}\n\n${DIFF || '<No changes detected>'}`;

// Copiar al portapapeles con confirmación clara
try {
    clipboardy.writeSync(FINAL_CONTENT);
    console.log(`\n📋 Success! The following has been copied to your clipboard:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`... [${DIFF.length} characters of git diff output] ...`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
} catch (error) {
    console.error(`❌ Failed to copy to clipboard: ${error.message}`);
    console.log(`You can manually copy this prompt:`);
    console.log(FINAL_CONTENT);
}

// Abrir la plataforma seleccionada con mejor feedback
const platform = AI_PLATFORMS[aiPlatform];
console.log(`\n🚀 Opening ${platform.name} in your default browser...`);
try {
    await open(platform.url);
    console.log(`✔ Successfully opened ${platform.name}`);
    console.log(`\n🎉 You're all set! Here's what to do next:
1. The AI prompt is already in your clipboard
2. Paste it (Ctrl+V/Cmd+V) in ${platform.name}
3. Review and refine the generated content
4. Use it for your commit or PR`);
} catch (error) {
    console.error(`❌ Failed to open ${platform.name}: ${error.message}`);
    console.log(`Please visit manually: ${platform.url}`);
}