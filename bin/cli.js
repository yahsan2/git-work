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

function getShellConfigFile() {
  const shell = process.env.SHELL || '';
  const home = os.homedir();
  
  if (shell.includes('zsh')) {
    return path.join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    // Check for .bash_profile on macOS, .bashrc on Linux
    const profilePath = path.join(home, '.bash_profile');
    const rcPath = path.join(home, '.bashrc');
    if (process.platform === 'darwin' && fs.existsSync(profilePath)) {
      return profilePath;
    }
    return rcPath;
  } else if (shell.includes('fish')) {
    return path.join(home, '.config', 'fish', 'config.fish');
  }
  
  // Default to .bashrc
  return path.join(home, '.bashrc');
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
  const wrapperSource = path.join(__dirname, '..', 'scripts', 'git-work-wrapper.sh');
  const scriptDest = path.join(installPath, SCRIPT_NAME);
  const wrapperDest = path.join(installPath, 'git-work-wrapper.sh');
  
  try {
    // Check if source scripts exist
    if (!fs.existsSync(scriptSource)) {
      console.error(`❌ Error: Script not found at ${scriptSource}`);
      process.exit(1);
    }
    
    if (!fs.existsSync(wrapperSource)) {
      console.error(`❌ Error: Wrapper script not found at ${wrapperSource}`);
      process.exit(1);
    }
    
    // Copy scripts to installation path
    fs.copyFileSync(scriptSource, scriptDest);
    fs.copyFileSync(wrapperSource, wrapperDest);
    
    // Make executable
    fs.chmodSync(scriptDest, '755');
    fs.chmodSync(wrapperDest, '755');
    
    console.log(`✅ Successfully installed git-work to ${scriptDest}`);
    
    // Setup shell integration
    const shellConfig = getShellConfigFile();
    const sourceCommand = `\n# git-work shell integration\nsource "${wrapperDest}"\n`;
    
    // Check if already configured
    let shellConfigContent = '';
    if (fs.existsSync(shellConfig)) {
      shellConfigContent = fs.readFileSync(shellConfig, 'utf8');
    }
    
    if (!shellConfigContent.includes('git-work shell integration')) {
      fs.appendFileSync(shellConfig, sourceCommand);
      console.log(`✅ Added shell integration to ${shellConfig}`);
    } else {
      console.log(`ℹ️  Shell integration already configured in ${shellConfig}`);
    }
    
    // Check if installation path is in PATH
    if (!checkInPath(installPath)) {
      console.log(`\n⚠️  Warning: ${installPath} is not in your PATH.`);
      console.log('   Add it to your shell configuration:');
      console.log(`\n   export PATH="${installPath}:$PATH"\n`);
    }
    
    console.log('\n✨ Installation complete!');
    console.log('\n🔄 Please reload your shell configuration:');
    console.log(`   source ${shellConfig}`);
    console.log('\nThen you can use:');
    console.log('   git work start <branch>  # Will automatically cd to the worktree');
    console.log('   git work back           # Will automatically cd back to main repo');
    
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
    const wrapperPath = path.join(installPath, 'git-work-wrapper.sh');
    
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
    
    if (fs.existsSync(wrapperPath)) {
      try {
        fs.unlinkSync(wrapperPath);
        console.log(`✅ Removed git-work-wrapper.sh from ${wrapperPath}`);
      } catch (error) {
        console.error(`❌ Error removing ${wrapperPath}: ${error.message}`);
      }
    }
  }
  
  // Note about shell configuration
  const shellConfig = getShellConfigFile();
  if (found) {
    console.log('\n⚠️  Note: Shell integration was not removed from your shell configuration.');
    console.log(`   To complete uninstallation, manually remove the git-work section from ${shellConfig}`);
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