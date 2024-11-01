#!/usr/bin/env node
// pr.mjs
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import open from 'open';
import clipboardy from 'clipboardy';
import robot from 'robotjs';
import { readFileSync } from 'fs'; // Import fs to read package.json


// Get the package version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const packageVersion = packageJson.version;

// Display the package version in a styled message
console.log(`
----------------------------------------------------
Author: Alexis Ayala <lex.solorio15@gmail.com>

 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗   ██████╗ ██████╗        ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗ 
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝   ██╔══██╗██╔══██╗      ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║█████╗██████╔╝██████╔╝█████╗██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║╚════╝██╔═══╝ ██╔══██╗╚════╝██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║      ██║     ██║  ██║      ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝      ╚═╝     ╚═╝  ╚═╝       ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

Version ${packageVersion}

Description: Use this tool to generate commit messages and pull request markdown effortlessly.

- - - - - - - - - - - - - - - - - - - - - - - - - -
USAGE: 
commit-pr-generator <PATH_TO_REPO> # Use it from anywhere
commit-pr-generator                # Leave in blank to use actual dir as path
----------------------------------------------------
`);

const PROMPT = `
Please draft markdown for a commit message for the following changes using Conventional Commits format, 
ensuring to include relevant emojis at the start:

Please draft markdown for a pull request for the following changes, 
ensure to include relevant emojis at the start, a title describing the changes. Leave a section for embedding images, 
and do not include 'Related Issues' or 'Checklist': 
`;

// Get the repository path from the command line or use the current directory
const repoPath = process.argv[2] || process.cwd();

// Change to the repository directory
try {
  process.chdir(repoPath);
} catch (error) {
  console.error('Error changing directory:', error.message);
  process.exit(1);
}

// Check if it's a Git repository
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
} catch {
  console.error('Not a Git repository. Make sure you are in a valid Git directory.');
  process.exit(1);
}

// Command to execute git diff, excluding specific files and directories
const diffCommand = `git diff -- . ':(exclude)package-lock.json' ':(exclude)node_modules' ':(exclude).env' ':(exclude).env.local' ':(exclude).env.production' ':(exclude)coverage' ':(exclude)dist' ':(exclude)yarn.lock'`;

// Capture the output of git diff
let DIFF;
try {
  DIFF = execSync(diffCommand, { encoding: 'utf-8' });
} catch (error) {
  console.error('Error executing git diff:', error.message);
  DIFF = '';
}

// Compose the final content to be copied
const FINAL_CONTENT = `${PROMPT}\n\n### Git Diff:\n\n${DIFF}`;

// Copy the content to the clipboard
clipboardy.writeSync(FINAL_CONTENT);
console.log('\nThe prompt has been copied to the clipboard.');

// Ask the user which URL to open
const { openUrl } = await inquirer.prompt([
  {
    type: 'list',
    name: 'openUrl',
    message: 'Which AI would you like to paste this prompt?',
    choices: [
      { name: 'ChatGPT', value: 'https://chatgpt.com/' },
      { name: 'Gemini', value: 'https://gemini.google.com/' }
    ],
  },
]);

// Open the chosen URL in the browser or exit if clipboard option is selected
if (openUrl !== 'clipboard') {
  await open(openUrl);

  // Wait briefly to ensure the browser has opened
  setTimeout(() => {
    // Simulate pasting clipboard content and pressing "enter"
    robot.keyTap('v', 'command'); // For Mac, use 'command'; for Windows/Linux, use 'control'
    robot.keyTap('enter');
  }, 2000); // Adjust timing if necessary
} else {
  console.log('The content has been copied to the clipboard. You can paste it where needed.');
}
