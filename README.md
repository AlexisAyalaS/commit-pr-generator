# Commit & PR Generator Tool 🤖📝

![Banner](https://github.com/user-attachments/assets/a5ec57bc-1f5d-422a-b1aa-1aeba1233b4f) *(optional: add a banner image)*

**commit-pr-generator** is a powerful CLI tool that automates the creation of professional commit messages and pull request descriptions. It intelligently formats content based on your `git diff` output following Conventional Commits standards, and seamlessly integrates with AI platforms to help you craft perfect documentation.

## 🌟 Key Features

- **Smart Change Analysis** - Automatically captures and formats your `git diff` output
- **AI-Powered Assistance** - Generates commit messages and PR descriptions with AI support
- **Customizable Exclusions** - Ignores unnecessary files (configurable via `.prignore`)
- **Multi-Platform Support** - Works with ChatGPT, DeepSeek, and Gemini
- **Seamless Workflow** - Copies prompts to clipboard and opens your preferred AI platform
- **Conventional Commits** - Follows industry-standard commit message formatting

## 📸 Screenshots

| Terminal Output | AI Platform Integration |
|-----------------|-------------------------|
| <img width="800" alt="Terminal Output" src="https://github.com/user-attachments/assets/a5ec57bc-1f5d-422a-b1aa-1aeba1233b4f"> | <img width="800" alt="AI Integration" src="https://github.com/user-attachments/assets/6c52e052-9eca-4126-8da4-1e849f9e2c78"> |

## 🚀 Installation

### Prerequisites
- Node.js v16+
- Git
- npm or yarn

### Install as global tool (recommended)
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

### Basic Usage
```bash
commit-pr-generator [PATH_TO_REPO] [AI_PLATFORM]
```

### Options
| Parameter      | Description                                                                 | Default           |
|----------------|-----------------------------------------------------------------------------|-------------------|
| `PATH_TO_REPO` | Path to git repository (use `.` for current directory)                      | Current directory |
| `AI_PLATFORM`  | AI platform to use (`chatgpt`, `deepseek`, or `gemini`)                     | `chatgpt`         |

### Examples
```bash
# Current directory with DeepSeek
commit-pr-generator . deepseek

# Specific path with ChatGPT
commit-pr-generator ~/projects/my-awesome-project

# With default settings (current dir + ChatGPT)
commit-pr-generator
```

## ⚙️ Configuration

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

## 🤖 Supported AI Platforms

| Platform       | URL                          | Default Prompt |
|----------------|------------------------------|----------------|
| ChatGPT        | https://chat.openai.com      | ✅             |
| DeepSeek Chat  | https://chat.deepseek.com    | ✅             |
| Google Gemini  | https://gemini.google.com    | ✅             |

## 🔧 How It Works

1. **Analyzes Changes**: Captures your `git diff` output while respecting exclusions
2. **Formats Prompt**: Creates an optimized prompt for AI platforms
3. **Copies to Clipboard**: Automatically copies the prompt for easy pasting
4. **Opens AI Platform**: Launches your preferred AI tool in browser (optional)
5. **Generate Content**: Use the AI's output for your commits/PRs

## 📜 Example Output

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