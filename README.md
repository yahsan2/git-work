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
git work start <branch>        # Create worktree and switch to it
git work list                  # List all worktrees with numbers
git work move <branch|num>     # Move to a worktree by name or number
git work back                  # Return to main repository
git work finish [branch|num]   # Remove worktree (current if not specified)
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
# Show all worktrees with numbers
git work list

# Show in machine-readable format
git work list --porcelain
```

### Move between worktrees

```bash
# Move to a specific worktree by name
git work move feature-x

# Move to a worktree by number (from git work list)
git work move 2
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

# Remove a specific worktree by branch name
git work finish feature-x

# Remove a worktree by number (from git work list)
git work finish 2
```

## How it works

### `git work start`

1. **Smart branch detection**: Automatically detects if you're referencing a remote or local branch
2. **Auto-fetch**: Fetches remote branches when needed
3. **Worktree creation**: Creates a new worktree in `../<repo>--<branch>` by default
4. **Directory navigation**: Automatically `cd` into the new worktree (only when not in tmux)
5. **Tmux integration**: Opens a new tmux pane in the worktree directory, keeping current pane unchanged

### `git work list`

Shows all worktrees in the current repository with numbered entries for easy reference. Use `--porcelain` for machine-readable output compatible with `git worktree list`.

### `git work move`

1. **Branch name mode**: With a branch name, immediately switches to that worktree
2. **Number mode**: With a number from `git work list`, switches to the corresponding worktree (0-based)
3. **Auto-navigation**: Automatically changes directory to the selected worktree
4. **Tmux integration**: When in main repository and tmux, opens new pane instead of changing directory

### `git work back`

1. **Navigation**: Returns to the main repository from a worktree
2. **Directory detection**: Uses standard naming pattern (`<repo>--<branch>`)
3. **Tmux integration**: When in tmux, closes the current pane and returns to first pane

### `git work finish`

1. **Flexible removal**: Remove current worktree (no args), by branch name, or by number
2. **Safety checks**: Warns about uncommitted changes and unpushed commits
3. **Cleanup**: Removes the worktree using `git worktree remove`
4. **Navigation**: Automatically returns to the main repository
5. **Tmux integration**: When removing current worktree in tmux, closes the pane and returns to first pane

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
# List worktrees to see numbers
$ git work list

Git worktrees:

  1) main (current)
     Path: /Users/you/projects/myapp
  2) feature-login
     Path: /Users/you/projects/myapp--feature-login
  3) bugfix-123
     Path: /Users/you/projects/myapp--bugfix-123

# Move using number
$ git work move 2

→ Moving to worktree for branch 'feature-login'
✓ Moved to worktree
  Branch: feature-login
  Location: /Users/you/projects/myapp--feature-login

# Or move using branch name
$ git work move bugfix-123

→ Moving to worktree for branch 'bugfix-123'
✓ Moved to worktree
  Branch: bugfix-123
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
