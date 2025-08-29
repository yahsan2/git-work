# git-work-space

A Git worktree management tool for efficient parallel development with automatic directory navigation.

## Features

- 🚀 Quick worktree creation with smart branch handling
- 📦 Automatic remote branch fetching
- 📁 Automatic directory navigation (cd) after operations
- 🖥️ Optional tmux integration (auto-split panes when available)
- 🔄 Easy navigation between worktrees and main repository
- 📋 List and switch between worktrees interactively
- 🗑️ Clean worktree removal with automatic navigation
- 🎯 Intuitive naming convention for worktree directories

## Installation

```bash
npx git-work-space install
```

This will install the `git work` command globally on your system.

## Usage

### Commands Overview

```bash
git work start <branch>  # Create worktree and switch to it
git work list            # List all worktrees
git work move [branch]   # Move to a worktree (interactive if no branch)
git work back            # Return to main repository
git work finish          # Remove current worktree and return to main
```

### Start working on a branch

```bash
# Create worktree for a new local branch
git work start feature-x

# Create worktree from a remote branch
git work start origin/feature-y

# Specify custom directory and base branch
git work start hotfix ../hotfix-dir main
```

### List all worktrees

```bash
# Show all worktrees
git work list

# Show in machine-readable format
git work list --porcelain
```

### Move between worktrees

```bash
# Move to a specific worktree
git work move feature-x

# Interactive selection (with fzf if available)
git work move
```

### Return to main repository

```bash
# Navigate back from worktree to main repository
git work back
```

### Finish and clean up

```bash
# Remove current worktree and return to main
git work finish
```

## How it works

### `git work start`

1. **Smart branch detection**: Automatically detects if you're referencing a remote or local branch
2. **Auto-fetch**: Fetches remote branches when needed
3. **Worktree creation**: Creates a new worktree in `../<repo>--<branch>` by default
4. **Directory navigation**: Automatically `cd` into the new worktree
5. **Tmux integration**: Opens a new tmux pane if you're in a tmux session

### `git work list`

Shows all worktrees in the current repository. This is a convenient alias for `git worktree list`.

### `git work move`

1. **Direct mode**: With a branch name, immediately switches to that worktree
2. **Interactive mode**: Without arguments, shows a numbered list or fzf interface for selection
3. **Auto-navigation**: Automatically changes directory to the selected worktree

### `git work back`

Returns to the main repository from a worktree (assuming standard naming pattern).

### `git work finish`

1. **Safety checks**: Warns about uncommitted changes and unpushed commits
2. **Cleanup**: Removes the worktree using `git worktree remove`
3. **Navigation**: Automatically returns to the main repository

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

### Switching between worktrees

```bash
$ git work move

Available worktrees:

  1) main
     Path: /Users/you/projects/myapp
  2) feature-login
     Path: /Users/you/projects/myapp--feature-login
  3) bugfix-123
     Path: /Users/you/projects/myapp--bugfix-123

Select worktree number (or press Enter to cancel): 2

→ Moving to worktree for branch 'feature-login'
✓ Moved to worktree
  Location: /Users/you/projects/myapp--feature-login
```

### Returning to main repository

```bash
# In a worktree directory
$ git work back

→ Returning to main repository: myapp
✓ Back to main repository
  Location: /Users/you/projects/myapp
```

### Cleaning up a worktree

```bash
# In a worktree directory
$ git work finish

→ Finishing work on branch 'feature-login'
→ Removing worktree at: /Users/you/projects/myapp--feature-login
✓ Successfully finished work on branch 'feature-login'
  Worktree removed: /Users/you/projects/myapp--feature-login
  Current location: /Users/you/projects/myapp
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
