#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SCRIPT_NAME = 'git-work';
const INSTALL_PATHS = [
  '/usr/local/bin',
  path.join(os.homedir(), '.local', 'bin'),
  path.join(os.homedir(), 'bin')
];

function findWritablePath() {
  for (const installPath of INSTALL_PATHS) {
    try {
      // Check if directory exists
      if (!fs.existsSync(installPath)) {
        // Try to create it if it's a user directory
        if (installPath.includes(os.homedir())) {
          try {
            fs.mkdirSync(installPath, { recursive: true });
          } catch {
            continue;
          }
        } else {
          continue;
        }
      }
      
      // Check if writable
      fs.accessSync(installPath, fs.constants.W_OK);
      return installPath;
    } catch {
      continue;
    }
  }
  return null;
}

function checkInPath(dir) {
  const pathEnv = process.env.PATH || '';
  return pathEnv.split(path.delimiter).includes(dir);
}

function install() {
  console.log('🚀 Installing git-work command...\n');
  
  // Find writable installation path
  const installPath = findWritablePath();
  
  if (!installPath) {
    console.error('❌ Error: No writable installation path found.');
    console.error('   Please run with sudo or ensure ~/.local/bin exists and is writable.');
    process.exit(1);
  }
  
  const scriptSource = path.join(__dirname, '..', 'scripts', 'git-work');
  const scriptDest = path.join(installPath, SCRIPT_NAME);
  
  try {
    // Check if source script exists
    if (!fs.existsSync(scriptSource)) {
      console.error(`❌ Error: Script not found at ${scriptSource}`);
      process.exit(1);
    }
    
    // Copy script to installation path
    fs.copyFileSync(scriptSource, scriptDest);
    
    // Make executable
    fs.chmodSync(scriptDest, '755');
    
    console.log(`✅ Successfully installed git-work to ${scriptDest}`);
    
    // Check if installation path is in PATH
    if (!checkInPath(installPath)) {
      console.log(`\n⚠️  Warning: ${installPath} is not in your PATH.`);
      console.log('   Add it to your shell configuration:');
      console.log(`\n   export PATH="${installPath}:$PATH"\n`);
    }
    
    // Test the installation
    try {
      execSync('git work --version', { stdio: 'pipe' });
      console.log('\n✨ Installation complete! You can now use:');
      console.log('   git work start <branch>');
      console.log('   git work back');
    } catch {
      console.log('\n✨ Installation complete!');
      console.log('   Restart your terminal or run:');
      console.log(`   export PATH="${installPath}:$PATH"`);
      console.log('\n   Then you can use:');
      console.log('   git work start <branch>');
      console.log('   git work back');
    }
    
  } catch (error) {
    console.error(`❌ Error during installation: ${error.message}`);
    if (error.code === 'EACCES') {
      console.error('   Try running with sudo: sudo npx git-tmux-work install');
    }
    process.exit(1);
  }
}

function uninstall() {
  console.log('🗑️  Uninstalling git-work command...\n');
  
  let found = false;
  for (const installPath of INSTALL_PATHS) {
    const scriptPath = path.join(installPath, SCRIPT_NAME);
    if (fs.existsSync(scriptPath)) {
      try {
        fs.unlinkSync(scriptPath);
        console.log(`✅ Removed git-work from ${scriptPath}`);
        found = true;
      } catch (error) {
        console.error(`❌ Error removing ${scriptPath}: ${error.message}`);
        if (error.code === 'EACCES') {
          console.error('   Try running with sudo: sudo npx git-tmux-work uninstall');
        }
      }
    }
  }
  
  if (!found) {
    console.log('ℹ️  git-work command not found in standard locations');
  } else {
    console.log('\n✨ Uninstallation complete!');
  }
}

function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'install':
      install();
      break;
    case 'uninstall':
      uninstall();
      break;
    default:
      console.log('Usage: npx git-tmux-work <command>');
      console.log('\nCommands:');
      console.log('  install    Install the git-work command');
      console.log('  uninstall  Remove the git-work command');
      process.exit(1);
  }
}

main();