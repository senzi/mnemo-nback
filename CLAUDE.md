# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite project for an M-nback working memory training game. The game presents users with addition problems (A + B = ?) and tests their ability to remember answers from N steps back.

## Key Commands

```bash
# Development
bun dev          # Start development server
bun build        # Build for production
bun preview      # Preview production build

# Package management
bun install      # Install dependencies
bun add <pkg>    # Add a dependency
bun remove <pkg> # Remove a dependency
```

## Architecture & Structure

### Core Game Logic
- **Game Flow**: Config → Memory Preview → Training → Results → Statistics
- **N-back Mechanism**: Compare current answer with answer from N steps ago
- **Question Generation**: A + B = ? where A ∈ [0,9], B ∈ [1,10-A], answer ∈ [1,10]

### Data Models
- **Training Record**: `{username, mode, N, question_count, correct_count, total_time_sec, accuracy, score, timestamp, exit_reason}`
- **Score Formula**: `score = [100 * (c/t)^0.8 * (r)^2] * (1 + (N-1)/5)`

### Storage & Export
- **Local Storage**: Browser LocalStorage for persistence
- **Export Format**: JSON with user records and first-error distribution analysis

### UI Components (Planned)
- **Config Screen**: Username, N-value (1-9), mode selection (12 questions/unlimited)
- **Memory Preview**: Show first N questions and answers before training
- **Training Interface**: Question display, answer buttons (1-10 in 2×5 grid)
- **Results**: Score summary with chart navigation
- **Statistics**: Personal performance charts and first-error analysis

### Technical Stack
- **Frontend**: Vue 3 + Vite + TypeScript
- **Styling**: daisyUI (recommended in PRD)
- **State Management**: Pinia/Zustand (to be implemented)
- **Charts**: ECharts/Chart.js (to be implemented)
- **Data Export**: Blob + JSON.stringify

## Development Notes

The project is currently in initial scaffolding phase with basic Vue 3 + Vite setup. The actual game implementation needs to be built according to the detailed PRD in `/docs/prd.md`.

### Next Steps
1. Set up TypeScript configuration
2. Install and configure Pinia for state management
3. Install daisyUI for styling
4. Implement core game components and logic
5. Add data persistence and export functionality
6. Implement statistics and visualization features