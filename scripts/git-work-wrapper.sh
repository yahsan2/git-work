#!/usr/bin/env bash

# git-work wrapper function for shell integration
# This file should be sourced in your shell configuration

git-work() {
    # Create temp files for stdout and stderr
    local temp_out=$(mktemp)
    local temp_err=$(mktemp)
    
    # Call the actual git-work script
    "$HOME/.local/bin/git-work" "$@" >"$temp_out" 2>"$temp_err"
    local exit_code=$?
    
    # Display stdout
    cat "$temp_out"
    
    # Extract the directory to cd into from stderr
    local cd_dir
    cd_dir=$(grep "^GITWORK_CD:" "$temp_err" 2>/dev/null | tail -1 | cut -d: -f2)
    
    # Display other stderr content (excluding GITWORK_CD line)
    grep -v "^GITWORK_CD:" "$temp_err" >&2
    
    # Clean up temp files
    rm -f "$temp_out" "$temp_err"
    
    # Change directory if needed
    if [ -n "$cd_dir" ] && [ -d "$cd_dir" ]; then
        cd "$cd_dir"
        echo -e "\033[0;36m📍 Changed to: $(pwd)\033[0m"
    fi
    
    return $exit_code
}

# Override git command to support 'git work'
git() {
    if [ "$1" = "work" ]; then
        shift
        git-work "$@"
    else
        command git "$@"
    fi
}