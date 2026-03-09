// ─────────────────────────────────────────────────────────
// lib/api.ts
// Fake API layer — replace each function body with a real
// fetch() call once the backend is ready.
// ─────────────────────────────────────────────────────────

/** Generic delay helper to simulate network latency */
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ── Types ──────────────────────────────────────────────────

export interface DashboardStats {
  totalTables: number;
  totalRows: number;
  queriesToday: number;
  activeUsers: number;
  rowsAddedThisWeek: number;
  querySuccessRate: number;
}

export interface ActivityItem {
  id: string;
  type: "query" | "insert" | "update" | "delete" | "schema";
  table: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface TableInfo {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  columnCount: number;
  keyColumnName: string;
  keyColumnMean: number;
  rowsAddedThisMonth: number;
  lastUpdated: string;
  schema: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Dashboard ──────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(600);
  // TODO: replace with → fetch('/api/dashboard/stats')
  return {
    totalTables: 12,
    totalRows: 847_293,
    queriesToday: 1_432,
    activeUsers: 18,
    rowsAddedThisWeek: 23_410,
    querySuccessRate: 98.6,
  };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  await delay(700);
  // TODO: replace with → fetch('/api/dashboard/activity')
  return [
    {
      id: "1",
      type: "query",
      table: "orders",
      description: "SELECT query on orders with date range filter",
      user: "analyst_1",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      type: "insert",
      table: "customers",
      description: "Inserted 45 new customer records from import",
      user: "admin",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "schema",
      table: "products",
      description: "Added index on 'category' column",
      user: "db_manager",
      timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "query",
      table: "order_items",
      description: "Aggregation query — average order value by region",
      user: "analyst_2",
      timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      type: "update",
      table: "products",
      description: "Bulk price update for seasonal sale (312 rows)",
      user: "admin",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: "6",
      type: "delete",
      table: "orders",
      description: "Archived orders older than 3 years (1,204 rows)",
      user: "db_manager",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// ── Explore Data ───────────────────────────────────────────

export async function getDatabaseTables(): Promise<TableInfo[]> {
  await delay(700);
  // TODO: replace with → fetch('/api/tables')
  return [
    {
      id: "1",
      name: "customers",
      description: "End-user customer profiles and credentials",
      rowCount: 48_312,
      columnCount: 8,
      keyColumnName: "lifetime_value",
      keyColumnMean: 284.75,
      rowsAddedThisMonth: 1_843,
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "2",
      name: "orders",
      description: "Purchase orders linked to customers and products",
      rowCount: 312_450,
      columnCount: 11,
      keyColumnName: "total_amount",
      keyColumnMean: 142.38,
      rowsAddedThisMonth: 9_217,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "3",
      name: "products",
      description: "Product catalogue with pricing and inventory info",
      rowCount: 4_892,
      columnCount: 10,
      keyColumnName: "unit_price",
      keyColumnMean: 38.92,
      rowsAddedThisMonth: 203,
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "4",
      name: "order_items",
      description: "Line items within each order with quantities",
      rowCount: 481_039,
      columnCount: 7,
      keyColumnName: "quantity",
      keyColumnMean: 3.21,
      rowsAddedThisMonth: 12_104,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "5",
      name: "users",
      description: "Internal application users and their roles",
      rowCount: 89,
      columnCount: 6,
      keyColumnName: "login_count",
      keyColumnMean: 47.6,
      rowsAddedThisMonth: 3,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      schema: "auth",
    },
    {
      id: "6",
      name: "categories",
      description: "Product category taxonomy and hierarchy",
      rowCount: 124,
      columnCount: 5,
      keyColumnName: "product_count",
      keyColumnMean: 39.5,
      rowsAddedThisMonth: 0,
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "7",
      name: "inventory",
      description: "Current stock levels and warehouse locations",
      rowCount: 4_892,
      columnCount: 9,
      keyColumnName: "stock_level",
      keyColumnMean: 218.4,
      rowsAddedThisMonth: 512,
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      schema: "public",
    },
    {
      id: "8",
      name: "analytics_events",
      description: "Raw clickstream and user interaction events",
      rowCount: 847_293,
      columnCount: 14,
      keyColumnName: "session_duration_s",
      keyColumnMean: 124.7,
      rowsAddedThisMonth: 98_204,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      schema: "analytics",
    },
  ];
}

// ── AI Analyzer ────────────────────────────────────────────

export async function sendAIMessage(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  await delay(1200);
  // TODO: replace with → fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) })

  const lower = message.toLowerCase();

  if (lower.includes("table") || lower.includes("schema")) {
    return "I can see you're asking about table structure. The database contains 8 tables across 3 schemas: `public`, `auth`, and `analytics`. The largest table is `analytics_events` with over 847K rows. Would you like me to run a specific query or describe a particular table in detail?";
  }
  if (lower.includes("order") || lower.includes("revenue") || lower.includes("sales")) {
    return "Based on the `orders` table, the average order value is **$142.38**. This month alone, 9,217 new orders were recorded. The top-performing category accounts for approximately 34% of total revenue. Shall I generate a breakdown by region or time period?";
  }
  if (lower.includes("customer")) {
    return "The `customers` table currently holds **48,312** records with a mean lifetime value of **$284.75**. 1,843 new customers were added this month. I can help you segment customers by purchase behavior, geography, or lifetime value. What analysis would you like?";
  }
  if (lower.includes("query") || lower.includes("sql")) {
    return "Sure! Here's an example query you might find useful:\n\n```sql\nSELECT c.name, SUM(o.total_amount) AS total_spent\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\nGROUP BY c.name\nORDER BY total_spent DESC\nLIMIT 10;\n```\n\nThis returns the top 10 customers by spend in the last 30 days. Would you like me to modify it?";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! I'm your AI database assistant. I can help you query your data, understand table schemas, analyze trends, and generate SQL queries. What would you like to explore today?";
  }

  return `I've analyzed your request: *"${message}"*.\n\nBased on the current database state, I can see relevant data across the connected tables. To give you the most accurate answer, I'll need to run a targeted query. Would you like me to generate the SQL, or would you prefer a natural-language summary of the available data?`;
}
