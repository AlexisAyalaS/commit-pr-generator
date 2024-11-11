#!/usr/bin/env node
// pr.mjs
import {execSync} from 'child_process';
import open from 'open';
import clipboardy from 'clipboardy';
import robot from 'robotjs';
import {readFileSync} from 'fs'; // Import fs to read package.json

// Utility function for error handling
const handleError = (message) => {
    console.error(`Error: ${message}`);
    process.exit(1);
};

// Get the package version
let packageVersion;
try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    packageVersion = packageJson.version;
} catch (error) {
    handleError('Could not read package.json or extract version.');
}

// Display the package version in a styled message
console.log(`
----------------------------------------------------

 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗   ██████╗ ██████╗        ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗ 
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝   ██╔══██╗██╔══██╗      ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║█████╗██████╔╝██████╔╝█████╗██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║╚════╝██╔═══╝ ██╔══██╗╚════╝██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║      ██║     ██║  ██║      ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝      ╚═╝     ╚═╝  ╚═╝       ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝

Version ${packageVersion}
Author: Alexis Ayala <lex.solorio15@gmail.com>
Description: Use this tool to generate commit messages and pull request markdown effortlessly.
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
    handleError(`Could not change directory: ${error.message}`);
}

// Check if it's a Git repository
try {
    execSync('git rev-parse --is-inside-work-tree', {stdio: 'ignore'});
} catch {
    handleError('Not a Git repository. Make sure you are in a valid Git directory.');
}

// Command to execute git diff, excluding specific files and directories
const diffCommand = `git diff -- . ':(exclude)package-lock.json' ':(exclude)node_modules' ':(exclude).env' ':(exclude).env.local' ':(exclude).env.production' ':(exclude)coverage' ':(exclude)dist' ':(exclude)yarn.lock' ':(exclude)middleware'`;

// Capture the output of git diff
let DIFF;
try {
    DIFF = execSync(diffCommand, {encoding: 'utf-8'});
} catch (error) {
    handleError(`Error executing git diff: ${error.message}`);
}

// Compose the final content to be copied
const FINAL_CONTENT = `${PROMPT}\n\n### Git Diff:\n\n${DIFF}`;

// Copy the content to the clipboard
clipboardy.writeSync(FINAL_CONTENT);
console.log('\nThe prompt has been copied to the clipboard.');

// Open ChatGPT URL by default
const openUrl = 'https://chatgpt.com/';

// Open the chosen URL in the browser or exit if clipboard option is selected
await open(openUrl);

// Wait briefly to ensure the browser has opened
setTimeout(() => {
    // Simulate pasting clipboard content and pressing "enter"
    robot.keyTap('v', 'command'); // For Mac, use 'command'; for Windows/Linux, use 'control'
    robot.keyTap('enter');
}, 2000); // Adjust timing if necessary
