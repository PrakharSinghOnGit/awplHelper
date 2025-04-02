import path from 'path';
import fs from 'fs';
import { FileUtils } from '../utils/file';
import { Logger } from '../utils/logger';
import type { AWPLData, ChequeData, LevelData, TargetData } from '../types';

/**
 * Handles generation of HTML reports from the scraped data
 */
export class HTMLGenerator {
  private static readonly CSS = `
    :root {
      --bg: #0d1117;
      --text: aliceblue;
      --nofocus: #30363d;
      --border: #30363d;
      --focus: rgb(0, 36, 126);
      --evenRow: #18202b;
      --clm1: #79c0ff;
      --clm2: #ff993f;
      --clm3: #7ee778;
      --clm4: #d2a8ff;
      --r: #ff7b72;
      --g: #7ee778;
    }
    * {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: monospace;
      font-weight: 600;
      background-color: var(--bg);
      color: var(--text);
    }
    h1, h3 {
      text-transform: uppercase;
      font-weight: normal;
    }
    .tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin: 10px;
      list-style: none;
    }
    .tabs .tab {
      flex: 1;
      text-align: center;
      margin: 0 2px;
      cursor: pointer;
    }
    .tabs .tab > input[type="radio"] {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    .tabs .tab > label {
      display: block;
      padding: 14px;
      font-size: larger;
      text-transform: uppercase;
      cursor: pointer;
      position: relative;
      color: #fff;
      background: var(--nofocus);
    }
    .tabs .content {
      z-index: 0;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 100%;
      position: absolute;
      background: var(--bg);
      left: 0;
      opacity: 0;
    }
    .content table {
      margin-top: 10px;
      width: 100%;
      border-collapse: collapse;
    }
    th {
      font-size: x-large;
      border-bottom: 2px solid var(--border);
    }
    td {
      font-size: medium;
    }
    th, td {
      border-right: 2px solid var(--border);
      padding: 8px;
      text-align: left;
      text-wrap: nowrap;
    }
    th:last-child, td:last-child {
      border-right: none;
    }
    td:nth-child(2) {
      color: var(--clm1);
    }
    td:nth-child(3) {
      color: var(--clm2);
    }
    td:nth-child(4) {
      color: var(--clm3);
    }
    td:nth-child(5) {
      color: var(--clm4);
    }
    tr:nth-last-of-type(even) {
      background-color: var(--evenRow);
    }
    .tabs > .tab > [id^="tab"]:checked + label {
      top: 0;
      background: var(--focus);
      color: var(--bg);
      font-size: x-large;
    }
    .tabs > .tab > [id^="tab"]:checked ~ [id^="tab-content"] {
      z-index: 1;
      opacity: 1;
    }
  `;

  /**
   * Generate HTML report from the scraped data
   */
  static generateHtml(teamName: string, data: AWPLData): string {
    // Sort data for better readability
    const sortedLevelData = this.sortData([...data.level]);
    const sortedTargetData = this.sortData([...data.target]);
    const sortedChequeData = this.sortData([...data.cheque]);
    
    // Generate HTML tables
    const levelTable = this.generateLevelTable(sortedLevelData);
    const targetTable = this.generateTargetTable(sortedTargetData);
    const chequeTable = this.generateChequeTable(sortedChequeData);
    
    // Get the current timestamp
    const timestamp = new Date().toLocaleString();
    
    // Create the full HTML document
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AWPL Data - ${teamName}</title>
          <style>${this.CSS}</style>
        </head>
        <body>
          <h1 style="text-align: center; margin: 10px;">${teamName}</h1>
          <p style="position: absolute; top: 10px; right: 0px; font-size: 1; font-weight: 100; color: rgb(185, 185, 185); margin: 0;">Generated: ${timestamp}</p>
          
          <div class="tabs">
            <div class="tab">
              <input type="radio" name="tabgroup" id="tab1" checked />
              <label for="tab1">Level</label>
              <div class="content" id="tab-content1">
                ${levelTable}
              </div>
            </div>
            
            <div class="tab">
              <input type="radio" name="tabgroup" id="tab2" />
              <label for="tab2">Target</label>
              <div class="content" id="tab-content2">
                ${targetTable}
              </div>
            </div>
            
            <div class="tab">
              <input type="radio" name="tabgroup" id="tab3" />
              <label for="tab3">Cheque</label>
              <div class="content" id="tab-content3">
                ${chequeTable}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate the level table HTML
   */
  private static generateLevelTable(levelData: LevelData[]): string {
    if (!levelData.length) {
      return '<p style="text-align: center; padding: 20px;">No level data available</p>';
    }
    
    let tableRows = '';
    levelData.forEach((item, index) => {
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.level}</td>
          <td>${item.sao ?? '-'}</td>
          <td>${item.sgo ?? '-'}</td>
        </tr>
      `;
    });
    
    return `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Level</th>
            <th>Pending SAO</th>
            <th>Pending SGO</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  }

  /**
   * Generate the target table HTML
   */
  private static generateTargetTable(targetData: TargetData[]): string {
    if (!targetData.length) {
      return '<p style="text-align: center; padding: 20px;">No target data available</p>';
    }
    
    let tableRows = '';
    targetData.forEach((item, index) => {
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.level}</td>
          <td>${item.sao ?? '-'}</td>
          <td>${item.sgo ?? '-'}</td>
        </tr>
      `;
    });
    
    return `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Level</th>
            <th>Pending SAO</th>
            <th>Pending SGO</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  }

  /**
   * Generate the cheque table HTML
   */
  private static generateChequeTable(chequeData: ChequeData[]): string {
    if (!chequeData.length) {
      return '<p style="text-align: center; padding: 20px;">No cheque data available</p>';
    }
    
    // Extract all unique dates
    const dates = new Set<string>();
    chequeData.forEach(item => {
      Object.keys(item.data).forEach(date => dates.add(date));
    });
    
    // Convert to sorted array
    const sortedDates = Array.from(dates).sort();
    
    // Generate header row with dates
    let headerCells = `
      <th>#</th>
      <th>Name</th>
      <th>Level</th>
    `;
    
    sortedDates.forEach(date => {
      headerCells += `<th>${date}</th>`;
    });
    
    // Generate rows for each user
    let tableRows = '';
    chequeData.forEach((item, index) => {
      let dataCells = '';
      
      sortedDates.forEach(date => {
        const value = item.data[date] || 0;
        const color = value > 0 ? 'var(--g)' : 'var(--r)';
        dataCells += `<td style="color: ${color}">${value}</td>`;
      });
      
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.level}</td>
          ${dataCells}
        </tr>
      `;
    });
    
    return `
      <table>
        <thead>
          <tr>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  }

  /**
   * Sort data by level and then by name
   */
  private static sortData<T extends { level: string; name: string }>(data: T[]): T[] {
    return [...data].sort((a, b) => {
      // First by level
      if (a.level !== b.level) {
        return a.level.localeCompare(b.level);
      }
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Save HTML report to file
   */
  static saveHtmlReport(teamName: string, data: AWPLData, outputDir: string): boolean {
    try {
      // Generate HTML content
      const html = this.generateHtml(teamName, data);
      
      // Ensure output directory exists
      FileUtils.ensureDirectoryExists(outputDir);
      
      // Save to file
      const filePath = path.join(outputDir, `${teamName}.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      
      Logger.success(`Generated HTML report for ${teamName} at ${filePath}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to generate HTML report for ${teamName}`, error as Error);
      return false;
    }
  }
} 