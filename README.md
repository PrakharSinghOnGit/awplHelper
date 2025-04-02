# AWPL Helper

A powerful tool for mining and visualizing AWPL data with improved reliability, performance, and maintainability.

## Features

- **Data Mining**: Efficiently extract level, target, and cheque information from the AWPL platform
- **Concurrency**: Process multiple users simultaneously using a cluster-based approach
- **Error Handling**: Robust error recovery and retry mechanisms
- **Interactive UI**: User-friendly command-line interface for selecting teams and functions
- **Visualized Reports**: Generate beautiful HTML reports with tabbed interface
- **Data Persistence**: Save extracted data in JSON format for future use

## Prerequisites

- [Bun](https://bun.sh/) 1.0.0 or higher
- Node.js 16.0.0 or higher

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/awplhelper.git
   cd awplhelper
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Build the project:
   ```
   bun run build
   ```

## Usage

### Starting the Mining Process

To start mining data:

```
bun run start
```

or using the CLI:

```
bun run src/index.ts start
```

This command will:
1. Prompt you to select one or more teams
2. Prompt you to select functions to mine (LEVEL, TARGET, CHEQUE)
3. Mine the data for each user in the selected teams
4. Generate HTML reports in the `out` directory

### Generating Reports from Existing Data

To generate HTML reports from previously mined data:

```
bun run src/index.ts print
```

### Opening the Output Directory

To open the directory containing the generated reports:

```
bun run src/index.ts out
```

### Clearing Output

To clear all output directories:

```
bun run src/index.ts clear
```

## Project Structure

```
awplhelper/
├── data/              # CSV files containing team data
├── src/               # Source code
│   ├── config/        # Configuration settings
│   ├── controllers/   # Main application controllers
│   ├── core/          # Core mining functionality
│   ├── services/      # Business logic services
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── json/              # Extracted data in JSON format
├── out/               # Generated HTML reports
├── dist/              # Compiled JavaScript files
├── package.json       # Project configuration
└── README.md          # This file
```

## Data Format

### Team CSV Format

Team data should be stored in CSV files in the `data` directory with the following format:

```csv
id,pass,name
ID1,PASSWORD1,NAME1
ID2,PASSWORD2,NAME2
```

- Lines beginning with `!` will be ignored
- The file name (without extension) will be used as the team name

## Development

To run the project in development mode with hot reloading:

```
bun run dev
```

## License

MIT
