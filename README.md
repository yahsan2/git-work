# git-tmux-work

A Git worktree management tool with tmux integration for efficient parallel development.

## Features

- 🚀 Quick worktree creation with smart branch handling
- 📦 Automatic remote branch fetching
- 🖥️ Seamless tmux integration (auto-split panes)
- 🔄 Easy navigation between worktrees and main repository
- 🎯 Intuitive naming convention for worktree directories

## Installation

```bash
npx git-tmux-work install
```

This will install the `git work` command globally on your system.

## Usage

### Start working on a branch

```bash
# Create worktree for a new local branch
git work start feature-x

# Create worktree from a remote branch
git work start origin/feature-y

# Specify custom directory and base branch
git work start hotfix ../hotfix-dir main
```

### Return to main repository

```bash
# Navigate back from worktree to main repository
git work back
```

## How it works

### `git work start`

1. **Smart branch detection**: Automatically detects if you're referencing a remote or local branch
2. **Auto-fetch**: Fetches remote branches when needed
3. **Worktree creation**: Creates a new worktree in `../<repo>--<branch>` by default
4. **Directory navigation**: Automatically `cd` into the new worktree
5. **Tmux integration**: Opens a new tmux pane if you're in a tmux session

### `git work back`

Returns to the main repository from a worktree (assuming standard naming pattern).

## Examples

### Working on a new feature

```bash
# In your main repository
$ git work start feature-login

→ Using origin/main as base branch
→ Creating worktree with new branch 'feature-login' from 'origin/main'
→ Worktree created at: ../myapp--feature-login
→ Changed to worktree directory
✓ Successfully started work on branch 'feature-login'
  Location: /Users/you/projects/myapp--feature-login
```

### Checking out a remote branch

```bash
$ git work start origin/bugfix-123

→ Fetching remote branch: origin/bugfix-123
→ Creating worktree with new branch 'bugfix-123' from 'origin/bugfix-123'
→ Worktree created at: ../myapp--bugfix-123
→ Changed to worktree directory
✓ Successfully started work on branch 'bugfix-123'
  Location: /Users/you/projects/myapp--bugfix-123
```

### Returning to main repository

```bash
# In a worktree directory
$ git work back

→ Returning to main repository: myapp
✓ Back to main repository
  Location: /Users/you/projects/myapp
```

## Directory Structure

The tool creates worktrees with a consistent naming pattern:

```
projects/
├── myapp/                    # Main repository
├── myapp--feature-login/     # Worktree for feature-login branch
├── myapp--bugfix-123/       # Worktree for bugfix-123 branch
└── myapp--release-v2/       # Worktree for release/v2 branch
```

## Requirements

- Git 2.5+ (for worktree support)
- Bash 4.0+
- Optional: tmux (for split-pane feature)

## Motivation

Git worktrees allow you to have multiple branches checked out simultaneously, which is perfect for:

- 🔧 Quick hotfixes without stashing current work
- 👀 Code review while working on features  
- 🔄 Parallel development on multiple features
- 📊 Comparing implementations across branches

This tool simplifies worktree management and adds quality-of-life improvements like tmux integration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Created with ❤️ for the Git community