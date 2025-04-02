declare module 'chromium' {
  const path: string;
}

declare module 'pending-xhr-puppeteer' {
  export class PendingXHR {
    constructor(page: any);
    waitForAllXhrFinished(): Promise<void>;
  }
}

declare module 'puppeteer-cluster' {
  export class Cluster {
    static CONCURRENCY_CONTEXT: string;
    static CONCURRENCY_PAGE: string;
    static CONCURRENCY_BROWSER: string;
    
    static launch(options: any): Promise<Cluster>;
    execute(data: any, callback: (args: any) => Promise<void>): Promise<void>;
    idle(): Promise<void>;
    close(): Promise<void>;
    on(event: string, callback: (err: Error, data: any) => void): void;
  }
} 