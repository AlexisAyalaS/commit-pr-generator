# commit-pr-generator

**commit-pr-generator** is a CLI tool designed to simplify the creation of commit messages and pull request descriptions. It automates the process by formatting the content based on `git diff` outputs and Conventional Commits, and optionally copies the text to your clipboard or opens an AI platform to help finalize your text.

## Screenshots
<img width="1618" alt="Captura de pantalla 2024-10-31 a la(s) 23 28 16" src="https://github.com/user-attachments/assets/a5ec57bc-1f5d-422a-b1aa-1aeba1233b4f">
<img width="1580" alt="Captura de pantalla 2024-10-31 a la(s) 23 31 31" src="https://github.com/user-attachments/assets/6c52e052-9eca-4126-8da4-1e849f9e2c78">


## Features

- **Automated Commit and PR Drafts**: Generates commit messages and pull request descriptions based on Conventional Commits.
- **Excludes Unwanted Files**: Filters out common files and directories (e.g., `node_modules`, `.env`) in `git diff`.
- **Clipboard Integration**: Copies the generated content directly to your clipboard.
- **Platform Selection**: Option to open preferred AI platforms (e.g., ChatGPT, Gemini) to finalize the generated text.

## 📝 Description: 
This tool helps developers generate professional commit messages 
and pull request markdown templates using AI platforms.

## ✨ Features:
- Automatically captures git diff of your changes
- Excludes common files (configurable via .prignore)
- Copies formatted prompt to clipboard
- Opens your preferred AI platform automatically

## 🌈 Available AI Platforms:
 - ChatGPT
 - DeepSeek
 - Gemini

## 🚀 Usage:
```bash
  commit-pr-generator [PATH_TO_REPO] [AI_PLATFORM]
```
  
  ### Options:
  * PATH_TO_REPO   Path to git repository (default: current directory)
  * AI_PLATFORM    Platform to open (${Object.keys(AI_PLATFORMS).join(', ')}) - default: chatgpt

## 💡 Examples:
  - commit-pr-generator . deepseek    # Use current dir with DeepSeek
  - commit-pr-generator ~/my-project  # Use specific path with ChatGPT

## Installation

Ensure you have Node.js installed, then install npm package:

```bash
npm install commit-pr-generator
```

or install as a global package

```bash
npm install -g commit-pr-generator
```


## Usage

Run the script with the following command:

```bash
commit-pr-generator <repo-path> <AI>
```

- `repo-path` _(optional)_: The path to the Git repository. If omitted, the current directory will be used.

Leave in blank path if you are in a git repository
```bash
commit-pr-generator <repo-path>
```

## Example

```bash
commit-pr-generator /path/to/your/repo deepseek
```

The script will:
1. Generate draft commit messages and PR descriptions.
2. Copy the output to your clipboard.
3. Prompt you to open an AI platform or exit.

## Requirements

- Node.js (v14+)
- Git
- Packages: `open`, `clipboardy`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions and improvements.
