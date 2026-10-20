# AWPL Helper API Backend

A high-performance backend API built with [Bun](https://bun.sh/) for extracting and mining Asclepius Wellness distributor data. Features built-in PIN security, request analytics, proxy rotation, and Docker packaging ready for **Render**, **Hugging Face Spaces**, or **Local Execution**.

---

## 📌 Base URLs

- **Local Development**: `http://localhost:10000`
- **Render Production**: `https://<your-service-name>.onrender.com`

---

## 🔐 Authentication & Security

All scraping and stats endpoints require an API Key / PIN (configured via the `PIN` or `API_KEY` environment variable on the server, default `1122`).

You can provide the PIN in **any one** of the following ways:

| Method                   | Syntax                                  | Example                                                |
| ------------------------ | --------------------------------------- | ------------------------------------------------------ |
| **Header (Recommended)** | `x-api-key: <PIN>`                      | `x-api-key: SHAANAWPL`                                 |
| **Bearer Token**         | `Authorization: Bearer <PIN>`           | `Authorization: Bearer SHAANAWPL`                      |
| **Request Body**         | `"pin": "<PIN>"` or `"apiKey": "<PIN>"` | `{"dsCode": "...", "pass": "...", "pin": "SHAANAWPL"}` |
| **URL Query Param**      | `?key=<PIN>` or `?pin=<PIN>`            | `GET /api/stats?key=SHAANAWPL`                         |

If the key is missing or invalid:

```json
// HTTP 401 Unauthorized
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API Key / PIN. Provide via 'x-api-key' header, 'pin' in JSON body, or '?key=' query param."
}
```

---

## 📋 Common Request Parameters

All `POST` endpoints accept a JSON request body with the following fields:

```typescript
interface ScraperRequestBody {
  /** Distributor User ID (required). Also accepts: id, awplid, username, memberid */
  dsCode: string;
  /** Distributor Password (required). Also accepts: password, pwd */
  pass: string;
  /** Security PIN (required if not passed via x-api-key header) */
  pin?: string;
  /** Maximum pages of payout history to crawl (optional, default: 100) */
  maxPages?: number;
  /** Start date filter for payouts in DD/MM/YYYY format (optional, default: "01/01/2000") */
  fromDate?: string;
  /** End date filter for payouts in DD/MM/YYYY format (optional) */
  toDate?: string;
  /** Custom proxy URL for this specific request (optional) */
  proxy?: string;
}
```

---

## 🚀 API Endpoints Specification

### 1. `POST /api/query` — Fetch All Data Concurrently

Runs parallel workers to mine every data section for the distributor simultaneously. **Best for initial load in a dashboard or mobile app.**

#### Request

- **Method**: `POST`
- **Path**: `/api/query`
- **Headers**:
  ```http
  Content-Type: application/json
  x-api-key: <YOUR_PIN>
  ```
- **Body**:
  ```json
  {
    "dsCode": "aa4f9b",
    "pass": "@1112",
    "maxPages": 50
  }
  ```

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "dsCode": "AA4F9B",
  "proxyUsed": "direct",
  "timestamp": "2026-10-20T07:30:00.000Z",
  "data": {
    "dashboard": {
      "name": "SUDHEER KUMAR SINGH",
      "saoTeamSp": 2840240.8,
      "sgoTeamSp": 1958058.95,
      "totalIncome": 28402815.8,
      "currentLevel": 13,
      "currentLevelName": "Royal Diamond",
      "nextLevel": 14,
      "nextLevelName": "Crown Diamond",
      "nextLevelTargetSao": 3072000,
      "nextLevelTargetSgo": 1536000
    },
    "weeklySP": [
      {
        "Closing Date": "15/10/2026",
        "SAO SP": "250.00",
        "SGO SP": "180.00",
        "Total SP": "430.00"
      }
    ],
    "bonanzaTargets": [],
    "tripAchievers": [],
    "levelPending": [
      {
        "Id": "1",
        "Step": "1",
        "LevelName": "Bronze",
        "TotalSAOSP": "200.00",
        "TotalSGOSP": "100.00",
        "SAOSP": "2840240.80",
        "SGOSP": "1958058.95",
        "RemainSAOSP": "0.00",
        "RemainSGOSP": "0.00",
        "Status": "Complete"
      }
    ],
    "payouts": [
      {
        "Cheque No.": "CHQ-10492",
        "Cheque Date": "14/10/2026",
        "Total Amount": "35,000.00",
        "TDS Amount": "1,750.00",
        "Admin Charges": "1,750.00",
        "Net Amount": "31,500.00",
        "Payment Status": "Payment Paid"
      }
    ]
  }
}
```

---

### 2. `POST /api/dashboard` — Member Profile & Rank Metrics

Returns the member's name, team Sales Points (SAO & SGO), total accumulated income, current rank name, and next rank targets.

#### Request

- **Method**: `POST`
- **Path**: `/api/dashboard`
- **Body**:
  ```json
  {
    "dsCode": "aa4f9b",
    "pass": "@1112"
  }
  ```

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "dsCode": "AA4F9B",
  "proxyUsed": "direct",
  "data": {
    "name": "SUDHEER KUMAR SINGH",
    "saoTeamSp": 2840240.8,
    "sgoTeamSp": 1958058.95,
    "totalIncome": 28402815.8,
    "currentLevel": 13,
    "currentLevelName": "Royal Diamond",
    "nextLevel": 14,
    "nextLevelName": "Crown Diamond",
    "nextLevelTargetSao": 3072000,
    "nextLevelTargetSgo": 1536000
  }
}
```

#### TypeScript Response Schema

```typescript
interface DashboardResponse {
  success: boolean;
  dsCode: string;
  proxyUsed: string;
  data: {
    name: string;
    saoTeamSp: number;
    sgoTeamSp: number;
    totalIncome: number;
    currentLevel: number;
    currentLevelName: string;
    nextLevel: number | null;
    nextLevelName: string | null;
    /** Null when member has achieved the top rank (Level 20) */
    nextLevelTargetSao: number | null;
    nextLevelTargetSgo: number | null;
  };
}
```

---

### 3. `POST /api/payouts` — Multi-Page Cheque & Payout Records

Extracts all payout cheques across all paginated pages using ASP.NET AJAX delta postback simulation.

#### Request

- **Method**: `POST`
- **Path**: `/api/payouts` (also accepts `/api/cheques`)
- **Body**:
  ```json
  {
    "dsCode": "aa4f9b",
    "pass": "@1112",
    "maxPages": 50,
    "fromDate": "01/01/2020",
    "toDate": "20/10/2026"
  }
  ```

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "dsCode": "AA4F9B",
  "count": 381,
  "proxyUsed": "direct",
  "data": [
    {
      "Id": "1",
      "Cheque No.": "782910",
      "Cheque Date": "15/10/2026",
      "Total Amount": "42,500.00",
      "TDS Amount": "2,125.00",
      "Admin Charges": "2,125.00",
      "Net Amount": "38,250.00",
      "Payment Status": "Payment Paid",
      "Transaction No": "AXISN1098273"
    }
  ]
}
```

---

### 4. `POST /api/levels` — Level Progress & Pending Requirements

Returns the status of every level step (1 to 20), including requirements, achieved SP, remaining SP, status (`Complete` / `Pending`), and the official rank name.

#### Request

- **Method**: `POST`
- **Path**: `/api/levels`
- **Body**:
  ```json
  {
    "dsCode": "aa4f9b",
    "pass": "@1112"
  }
  ```

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "dsCode": "AA4F9B",
  "count": 20,
  "proxyUsed": "direct",
  "data": [
    {
      "Id": "1",
      "Step": "1",
      "LevelName": "Bronze",
      "TotalSAOSP": "200.00",
      "TotalSGOSP": "100.00",
      "SAOSP": "2840240.80",
      "SGOSP": "1958058.95",
      "RemainSAOSP": "0.00",
      "RemainSGOSP": "0.00",
      "Status": "Complete"
    },
    {
      "Id": "14",
      "Step": "14",
      "LevelName": "Crown Diamond",
      "TotalSAOSP": "3072000.00",
      "TotalSGOSP": "1536000.00",
      "SAOSP": "2840240.80",
      "SGOSP": "1958058.95",
      "RemainSAOSP": "231759.20",
      "RemainSGOSP": "0.00",
      "Status": "Pending"
    }
  ]
}
```

---

### 5. `POST /api/weekly` — Weekly Sales Points (SP)

Returns weekly SP generation records by closing date.

#### Request

- **Method**: `POST`
- **Path**: `/api/weekly`
- **Body**:
  ```json
  {
    "dsCode": "aa4f9b",
    "pass": "@1112"
  }
  ```

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "dsCode": "AA4F9B",
  "count": 12,
  "proxyUsed": "direct",
  "data": [
    {
      "Closing Date": "15/10/2026",
      "SAO SP": "250.00",
      "SGO SP": "180.00",
      "Total SP": "430.00"
    }
  ]
}
```

---

### 6. `POST /api/bonanza` — Winter Bonanza Targets

Returns active or historical bonanza qualification records.

#### Request

- **Method**: `POST`
- **Path**: `/api/bonanza`
- **Body**: `{"dsCode": "aa4f9b", "pass": "@1112"}`

---

### 7. `POST /api/trips` — Trip Achiever List

Returns domestic and international trip qualification achievements.

#### Request

- **Method**: `POST`
- **Path**: `/api/trips`
- **Body**: `{"dsCode": "aa4f9b", "pass": "@1112"}`

---

### 8. `GET /health` — Public Health Check & Keep-Alive

Returns `200 OK`. **Does not require authentication.** Used by UptimeRobot, Render Health Check, and cron pingers to keep the instance alive.

#### Request

- **Method**: `GET`
- **Path**: `/health`

#### Response (`HTTP 200 OK`)

```json
{
  "status": "healthy",
  "service": "awpl-helper-backend",
  "timestamp": "2026-10-20T07:35:10.123Z"
}
```

---

### 9. `GET /api/stats` — Usage & Traffic Analytics

Returns aggregated stats, request counts, response latency, top client IPs, and the 50 most recent request logs.

#### Request

- **Method**: `GET`
- **Path**: `/api/stats?key=<YOUR_PIN>` (or pass `x-api-key: <PIN>` header)

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "timestamp": "2026-10-20T07:35:10.123Z",
  "summary": {
    "totalRequests": 142,
    "successRequests": 138,
    "failedRequests": 4,
    "requestsLast24h": 56,
    "requestsLast1h": 12,
    "avgDurationMs": 840,
    "topIps": [
      {
        "ip": "152.58.12.34",
        "count": 48,
        "lastSeen": "2026-10-20T07:34:00.000Z"
      }
    ],
    "topDsCodes": [
      {
        "dsCode": "AA4F9B",
        "count": 32,
        "lastSeen": "2026-10-20T07:34:00.000Z"
      }
    ],
    "endpointBreakdown": [
      { "path": "/api/query", "count": 65 },
      { "path": "/api/dashboard", "count": 40 }
    ],
    "recentLogs": [
      {
        "id": 142,
        "timestamp": "2026-10-20T07:34:00.000Z",
        "ip": "152.58.12.34",
        "method": "POST",
        "path": "/api/dashboard",
        "dsCode": "AA4F9B",
        "status": 200,
        "durationMs": 750,
        "error": null
      }
    ]
  }
}
```

---

### 10. `GET /api/ip` — Outbound Public IP & Proxy Status

Returns the public IP address the backend server uses to communicate with Asclepius, verifying if proxy rotation is active.

#### Request

- **Method**: `GET`
- **Path**: `/api/ip?key=<YOUR_PIN>`

#### Response (`HTTP 200 OK`)

```json
{
  "success": true,
  "outboundIp": "103.212.43.12",
  "proxyUsed": "http://user:pass@proxy.example.com:8080",
  "configuredProxy": "Enabled"
}
```

---

## 🏆 Ranks & Levels Reference Table

The backend automatically maps numerical levels (`1`–`20`) to their official titles:

| Level  | Rank Name               | Required SAO SP | Required SGO SP |
| :----: | :---------------------- | :-------------: | :-------------: |
| **1**  | Bronze                  |       200       |       100       |
| **2**  | Silver                  |       600       |       300       |
| **3**  | Gold                    |      1,200      |       600       |
| **4**  | Platinum                |      2,400      |      1,200      |
| **5**  | Emerald                 |      4,800      |      2,400      |
| **6**  | Topaz                   |     12,000      |      6,000      |
| **7**  | Ruby Star               |     24,000      |     12,000      |
| **8**  | Sapphire Star           |     48,000      |     24,000      |
| **9**  | Star Sapphire           |     96,000      |     48,000      |
| **10** | Diamond                 |     192,000     |     96,000      |
| **11** | Blue Diamond            |     384,000     |     192,000     |
| **12** | Black Diamond           |     768,000     |     384,000     |
| **13** | Royal Diamond           |    1,536,000    |     768,000     |
| **14** | Crown Diamond           |    3,072,000    |    1,536,000    |
| **15** | Ambassador              |    6,144,000    |    3,072,000    |
| **16** | Royal Ambassador        |   12,288,000    |    6,144,000    |
| **17** | Crown Ambassador        |   24,576,000    |   12,288,000    |
| **18** | Brand Ambassador        |   49,152,000    |   24,576,000    |
| **19** | Chief Brand Ambassador  |   196,605,200   |   49,152,000    |
| **20** | Global Brand Ambassador |   393,213,200   |   196,605,200   |

---

## ⚠️ Error Handling & Status Codes

All errors return JSON with `success: false` and an `error` message string:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

| HTTP Code              | Reason                                | Common Cause                                                                             |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| **`400 Bad Request`**  | Missing parameters or invalid JSON    | Missing `dsCode` or `pass` in body                                                       |
| **`401 Unauthorized`** | PIN failure or bad portal credentials | 1) Wrong API PIN<br>2) "Invalid credentials: Invalid DS Code or Password" from Asclepius |
| **`404 Not Found`**    | Unknown endpoint                      | Typo in route path or wrong HTTP method                                                  |
| **`500 Server Error`** | Network or parsing error              | Asclepius portal server down or timeout                                                  |

---

```

---

## 🛠️ Deployment on Render

### 1. Deployed via Render Blueprint

this project is deployed on render
here is the link
https://awpl-helper-backend.onrender.com/
```
