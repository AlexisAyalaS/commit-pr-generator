# Commit & PR Generator 🤖📝

[![npm version](https://badge.fury.io/js/commit-pr-generator.svg)](https://badge.fury.io/js/commit-pr-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/commit-pr-generator.svg)](https://nodejs.org/)

**commit-pr-generator** is a powerful CLI tool that automates the creation of professional commit messages and pull request descriptions. It intelligently analyzes your code using `git diff` following Conventional Commits standards and integrates seamlessly with AI platforms to help you create perfect documentation.

## 🌟 Key Features

- **Intelligent Change Analysis** - Automatically captures and formats your `git diff` output
- **AI-Powered Assistance** - Generates commit messages and PR descriptions with AI support
- **Multi-Language Support** - Responses in English (default) or Spanish
- **Customizable Exclusions** - Ignore unnecessary files (configurable via `.prignore`)
- **Multi-Platform Support** - Works with ChatGPT, DeepSeek, and Gemini
- **Simplified Workflow** - Saves results in markdown files as history
- **Conventional Commits** - Follows industry-standard format for commit messages
- **Enhanced Interactive Mode** - Clear interface for selecting processes

## 🚀 Installation

### Prerequisites
- **Node.js v16+** (recommended v18+)
- **Git** installed and configured
- **npm** or **yarn** as package manager

### Quick Installation

#### 1. Clone the repository
```bash
git clone https://github.com/AlexisAyalaS/commit-pr-generator.git
cd commit-pr-generator
```

#### 2. Automatic setup
```bash
npm run setup
```

#### 3. Install dependencies
```bash
npm install
```

#### 4. Ready to use!
```bash
git-ai
```

> 📖 **Installation problems?** Check the detailed [Installation Guide](INSTALL.md) for step-by-step instructions and troubleshooting.

### Manual Installation

If you prefer to configure manually:

#### 1. Install dependencies
```bash
npm install
```

#### 2. Create directory for generated files
```bash
mkdir generated-files
```

#### 3. Configure configuration file
```bash
cp commit-pr-config.example.json commit-pr-config.json
```

#### 4. Run
```bash
git-ai
```

### Install as global tool (recommended for frequent use)
```bash
npm install -g commit-pr-generator
# or
yarn global add commit-pr-generator
```

### Install as project dependency
```bash
npm install commit-pr-generator --save-dev
# or
yarn add commit-pr-generator --dev
```

## 💻 Usage

### Basic Usage (Interactive Mode)
```bash
git-ai
```

### Usage with Options
```bash
git-ai [OPTIONS]
```

### Available Options
```bash
Options:
  -V, --version     Show version number
  -v, --verbose     Show detailed debugging information
  -h, --help        Show help
```

## 🎯 Available Processes

The enhanced interactive mode allows you to choose between these processes:

1. **📝 Generate Pull Request message** - Creates complete PR descriptions with demo section
2. **💬 Suggest commit message** - Generates commit messages following Conventional Commits
3. **🌿 Suggest branch name** - Proposes the best name for new branches (direct format)
4. **🔄 Perform multiple processes** - Runs several processes in a single session
5. **🗑️ Delete generated files history** - Cleans the history folder

## 🌍 Multi-Language Support

The generator supports responses in multiple languages:

- **🇺🇸 English** - Default language
- **🇪🇸 Spanish** - Complete Spanish support

### Language Configuration

#### Interactive Mode
The interactive mode allows you to select the language at the beginning of the process.

#### Configuration File
You can configure the default language in `commit-pr-config.json`:

```json
{
  "language": "es"
}
```

## 🖥️ Cross-Platform Compatibility

**commit-pr-generator** is designed to work on all major platforms:

### ✅ Supported Operating Systems
- **🪟 Windows** (Windows 10/11, Windows Server)
- **🍎 macOS** (macOS 10.15+, Apple Silicon and Intel)
- **🐧 Linux** (Ubuntu, Debian, CentOS, RHEL, etc.)

### ✅ Platform Requirements

#### Windows
- **Node.js v16+** (recommended v18+)
- **Git for Windows** or **GitHub Desktop**
- **PowerShell** or **Command Prompt**
- **npm** or **yarn**

#### macOS
- **Node.js v16+** (recommended v18+)
- **Git** (included with Xcode Command Line Tools)
- **Terminal** or **iTerm2**
- **npm** or **yarn**

#### Linux
- **Node.js v16+** (recommended v18+)
- **Git** (`sudo apt install git` on Ubuntu/Debian)
- **Native Terminal**
- **npm** or **yarn**

### 🔧 Compatibility Features

#### File Paths
- ✅ **Cross-platform paths** using Node.js `path.join()`
- ✅ **Automatic separators** (`/` on Unix, `\` on Windows)
- ✅ **Space handling** in file and directory names

#### Git Commands
- ✅ **Automatic platform detection** (`process.platform`)
- ✅ **Platform-specific syntax** (`:!` vs `:(exclude)` for Windows)
- ✅ **UTF-8 encoding** for special characters

#### Permissions and Files
- ✅ **Automatic directory creation** with `recursive: true`
- ✅ **Cross-platform permission handling**
- ✅ **Standard JSON configuration files**

### 🧪 Compatibility Testing

The project has been tested on:
- ✅ **Windows 11** with PowerShell and Git Bash
- ✅ **macOS Monterey/Ventura** with Terminal
- ✅ **Ubuntu 20.04/22.04** with native Terminal
- ✅ **WSL2** (Windows Subsystem for Linux)

### 🚨 Platform-Specific Troubleshooting

#### Windows
```bash
# If there are permission issues
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# If Git is not found
# Install Git for Windows from: https://git-scm.com/download/win
```

#### macOS
```bash
# If there are issues with Xcode Command Line Tools
xcode-select --install

# If there are file permission issues
sudo chmod +x commit-pr-generator.mjs
```

#### Linux
```bash
# Install Git if not available
sudo apt update && sudo apt install git

# Give execution permissions
chmod +x commit-pr-generator.mjs main.mjs setup.mjs
```

## 🤖 Supported AI Platforms

- **🤖 ChatGPT** - OpenAI
- **🧠 DeepSeek Chat** - DeepSeek
- **💎 Google Gemini** - Google

## 📁 History System

All results are automatically saved in the `generated-files/` folder with date format:

```
generated-files/
├── pr-2025-01-22.md          # Pull Request message
├── pr-2025-01-22-2.md        # Second PR of the same day
├── commit-2025-01-22.md      # Commit message
├── branch-2025-01-22.md      # Branch name suggestions
└── multiple-2025-01-22.md    # Multiple processes combined
```

### 🔢 Automatic Numbering System

- **No overwriting**: If you generate multiple files of the same type on the same day, they are automatically numbered
- **Format**: `type-YYYY-MM-DD-N.md` where N is the sequential number
- **Example**: `pr-2025-01-22.md`, `pr-2025-01-22-2.md`, `pr-2025-01-22-3.md`

### 🔄 Multiple Processes

When you select "Perform multiple processes", all results are combined in a single file:
- **File**: `multiple-YYYY-MM-DD.md`
- **Separation**: Each process is separated with `--------`
- **Content**: Branch, Commit and PR in a single organized file
- **Order**: Always displayed in order: Branch → Commit → PR

Each file includes:
- AI-generated content
- Clean and direct format
- **Automatic opening**: The file opens automatically after generation

### 🎯 Ultra Simplified Format

For maximum efficiency, some content types are generated in ultra simplified format:

- **Branch names**: Only the recommended name (e.g., `feat/interactive-mode-implementation`)
- **Commit messages**: Only the message (e.g., `feat: implement improved interactive mode`)
- **Pull Requests**: Complete content with detailed structure and demo section

## ⚙️ Advanced Configuration

### Configuration File (`commit-pr-config.json`)

```json
{
  "prompts": {
    "default": "Please draft markdown for a pull request...",
    "commit": "Please generate a commit message...",
    "detailed": "Please create a comprehensive pull request...",
    "branch-name": "Please suggest appropriate branch names..."
  },
  "defaultExclusions": [
    "package-lock.json",
    "node_modules",
    ".env",
    "*.log"
  ],
  "logging": {
    "level": "info",
    "enableColors": true
  },
  "git": {
    "checkStagedChanges": true,
    "checkUnstagedChanges": true,
    "maxDiffSize": 50000
  },
  "language": "en"
}
```

### Exclusion Patterns (`.prignore`)

Create a `.prignore` file in your project root to exclude specific files:

```
node_modules/
*.log
dist/
coverage/
.env*
```

## 📝 Examples

### Interactive Mode
```bash
# Start interactive mode
git-ai

# Select: Multiple processes
# Select: English
# Select: DeepSeek
# Result: All files generated automatically
```

### Global Installation
```bash
# Install globally
npm install -g commit-pr-generator

# Use from anywhere
git-ai
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Conventional Commits](https://www.conventionalcommits.org/) for the commit message standard
- [OpenAI](https://openai.com/) for ChatGPT
- [DeepSeek](https://www.deepseek.com/) for DeepSeek Chat
- [Google](https://ai.google.dev/) for Gemini

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: lex.solorio15@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/AlexisAyalaS/commit-pr-generator/issues)
- 📖 **Documentation**: [README](README.md)

---

**Made with ❤️ by [Alexis Ayala Solorio](https://github.com/AlexisAyalaS)**

### 🎬 Sección de Demo en PRs

Los Pull Requests generados incluyen una sección de demo que muestra:
- **Instrucciones paso a paso** para usar el sistema
- **Comandos de ejemplo** para ejecutar el generador
- **Opciones disponibles** en el modo interactivo
- **Ejemplos de uso** tanto en modo interactivo como legacy

### 📂 Apertura Automática de Archivos

Después de generar cualquier archivo, el sistema:
- **Abre automáticamente** el archivo generado en tu editor predeterminado
- **Muestra confirmación** de que el archivo se abrió exitosamente
- **Proporciona fallback** si no se puede abrir automáticamente (muestra la ruta manual)

### 🗑️ Gestión del Historial

El sistema incluye una opción para limpiar el historial:
- **🗑️ Eliminar historial de archivos generados**: Elimina todos los archivos de la carpeta `generated-files/`
- Confirmación de seguridad antes de eliminar
- Lista de archivos que serán eliminados
```bash
commit-pr-generator [PATH_TO_REPO] [AI_PLATFORM] [OPTIONS]
```

### Options
| Option                    | Description                                                                 | Default           |
|---------------------------|-----------------------------------------------------------------------------|-------------------|
| `PATH_TO_REPO`            | Path to git repository (use `.` for current directory)                      | Current directory |
| `AI_PLATFORM`             | AI platform to use (`chatgpt`, `deepseek`, or `gemini`)                     | `chatgpt`         |
| `-p, --prompt <type>`     | Prompt type (`default`, `commit`, `detailed`, `branch-name`)                 | `default`         |
| `-d, --dry-run`           | Show what would be done without executing actions                           | `false`           |
| `-v, --verbose`           | Show detailed debugging information                                         | `false`           |
| `--no-open`               | Don't automatically open the AI platform                                   | `false`           |
| `--no-copy`               | Don't copy the prompt to clipboard                                          | `false`           |
| `--check-staged`          | Only check for staged changes                                               | `true`            |
| `--check-unstaged`        | Only check for unstaged changes                                             | `true`            |
| `--max-diff-size <size>`  | Maximum diff size in characters                                             | `50000`           |
| `-i, --interactive`       | Interactive mode to select action and configure options                     | `false`           |
| `-g, --generate`          | Generate markdown file automatically with AI                                | `false`           |
| `--overwrite`             | Overwrite existing files                                                    | `false`           |
| `-l, --language <lang>`  | Language for responses (en/es)                                               | `en`              |

### Examples
```bash
# Basic usage - current directory with DeepSeek
commit-pr-generator . deepseek

# Specific path with ChatGPT
commit-pr-generator ~/projects/my-awesome-project

# With default settings (current dir + ChatGPT)
commit-pr-generator

# Dry run to see what would happen
commit-pr-generator . chatgpt --dry-run

# Verbose mode with detailed output
commit-pr-generator . deepseek --verbose

# Use commit-specific prompt
commit-pr-generator . chatgpt --prompt commit

# Don't open browser, just copy to clipboard
commit-pr-generator . gemini --no-open

# Check only staged changes
commit-pr-generator . chatgpt --check-unstaged=false

# Interactive mode - guided setup
commit-pr-generator . --interactive

# Get branch name suggestions
commit-pr-generator . deepseek --prompt branch-name

# Generate markdown file automatically
commit-pr-generator . chatgpt --prompt default --generate

# Generate commit message file
commit-pr-generator . deepseek --prompt commit --generate

# Overwrite existing files
commit-pr-generator . gemini --prompt detailed --generate --overwrite

# Use Spanish language
commit-pr-generator . deepseek --language es

# Use English language (default)
commit-pr-generator . chatgpt --language en
```

## ⚙️ Configuration

### Advanced Configuration
Create a `commit-pr-config.json` file in your project root for advanced customization:

```json
{
  "prompts": {
    "default": "Your custom default prompt...",
    "commit": "Your custom commit prompt...",
    "detailed": "Your custom detailed prompt..."
  },
  "defaultExclusions": [
    "package-lock.json",
    "node_modules",
    ".env",
    "coverage",
    "dist"
  ],
  "logging": {
    "level": "info",
    "enableColors": true
  },
  "git": {
    "checkStagedChanges": true,
    "checkUnstagedChanges": true,
    "maxDiffSize": 50000
  },
  "language": "en"
}
```

### Custom File Exclusions
Create a `.prignore` file in your project root to specify patterns to exclude from `git diff`:

```gitignore
# .prignore example
*.log
*.tmp
dist/
coverage/
.DS_Store
```

If no `.prignore` is found, the tool uses these default exclusions:
- `package-lock.json`
- `node_modules/`
- `.env`
- `coverage/`
- `dist/`
- `yarn.lock`

### Prompt Types
The tool supports different prompt types for various use cases:

- **`default`**: Standard pull request description
- **`commit`**: Short commit message following Conventional Commits
- **`detailed`**: Comprehensive PR description with all sections
- **`branch-name`**: Suggestions for appropriate branch names based on changes

## 🤖 Supported AI Platforms

| Platform       | URL                          | Default Prompt |
|----------------|------------------------------|----------------|
| ChatGPT        | https://chat.openai.com      | ✅             |
| DeepSeek Chat  | https://chat.deepseek.com    | ✅             |
| Google Gemini  | https://gemini.google.com    | ✅             |

## 🎯 Interactive Mode

The tool features an interactive mode that guides you through the process:

```bash
git-ai
```

### Interactive Features:
- **Action Selection**: Choose between PR description, commit message, detailed PR, or branch name suggestions
- **Language Selection**: Select your preferred language (English or Spanish)
- **Platform Selection**: Pick your preferred AI platform (ChatGPT, DeepSeek, Gemini)
- **Automatic Generation**: Creates markdown files with AI content automatically

### Interactive Workflow:
1. Select what you want to generate
2. Choose your preferred language
3. Choose your AI platform
4. Content is generated and saved automatically

## 🤖 Automatic Markdown Generation

The tool features automatic content generation that creates markdown files directly:

### Features:
- **Direct AI Integration**: Generates content using AI APIs
- **Automatic File Creation**: Creates timestamped markdown files
- **Multiple Content Types**: PR descriptions, commit messages, branch suggestions
- **Rich Formatting**: Includes metadata, timestamps, and helpful links
- **Overwrite Protection**: Prevents accidental file overwrites

### Generated Files:
- `pull-request-description-YYYY-MM-DD.md`
- `commit-message-YYYY-MM-DD.md`
- `detailed-pr-description-YYYY-MM-DD.md`
- `branch-name-suggestions-YYYY-MM-DD.md`

## 🔧 How It Works

1. **Interactive Selection**: Choose your desired process (PR, commit, branch name, or multiple)
2. **Language Selection**: Select your preferred language (English or Spanish)
3. **AI Platform Selection**: Choose your preferred AI platform (ChatGPT, DeepSeek, or Gemini)
4. **Analyzes Changes**: Captures your `git diff` output while respecting exclusions
5. **Generates Content**: Creates AI-powered content and saves it to markdown files
6. **Automatic Opening**: Opens the generated file in your default editor

## 📜 Example Output

### Pull Request Description
```markdown
# [FEATURE] Add user authentication system 🔐

## Changes Made
- Implemented JWT-based authentication
- Added user model and migration
- Created auth middleware
- Set up protected routes

## Technical Details
- Uses bcrypt for password hashing
- Implements 60-minute JWT expiry
- Includes refresh token mechanism

## Demo
![Auth Flow](https://example.com/auth-demo.gif)
```

### Branch Name Suggestions
```
- feat/user-authentication-system
- feat/jwt-auth-implementation
- feat/auth-middleware-setup
- feat/protected-routes
- feat/user-model-migration
```

### Generated Markdown File Example
```markdown
# Branch Name Suggestions

> **Generado automáticamente** el 2025-10-22 a las 22:43:12  
> **Plataforma de IA:** deepseek  
> **Herramienta:** commit-pr-generator v0.1.0

---

# Sugerencias de nombres de rama generadas por DeepSeek

Basándome en los cambios detectados, aquí tienes algunas sugerencias:

- feat/user-authentication-system
- feat/jwt-auth-implementation
- feat/auth-middleware-setup

## Recomendación principal
**feat/user-authentication-system** - Este nombre describe mejor la funcionalidad principal.

---
*Generado automáticamente por commit-pr-generator con DeepSeek*
```

## 🧪 Testing

The project includes comprehensive unit tests using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- Git utilities validation
- Configuration management
- Error handling scenarios
- Cross-platform compatibility

## 📝 License

MIT © [Alexis Ayala](https://github.com/yourusername)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR for any improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

💡 **Pro Tip**: Add an alias to your shell config for even faster access:
```bash
echo "alias prg='commit-pr-generator'" >> ~/.zshrc  # or ~/.bashrc
source ~/.zshrc
```