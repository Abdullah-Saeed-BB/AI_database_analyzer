from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from datetime import datetime, date
from db.session import get_db
from models.models import Order, Product, Customer, User, OrderItem
from src.auth import get_current_user
import calendar

router = APIRouter()

TABLE_MAP = {
    "orders": Order,
    "products": Product,
    "customers": Customer
}

TABLE_COLUMNS = {
    "orders": ["id", "invoice_date", "country", "customer", "number_of_items", "total"],
    "products": ["id", "title", "rate", "in_stock"],
    "customers": ["id", "name", "email", "password"]
}

@router.get("/stats", summary="Get main information about the main tables")
def get_tables_info(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns the row counts and basic metadata for Orders, Products, and Customers.
    """
    info = []
    for name, model in TABLE_MAP.items():
        try:
            count = db.query(func.count()).select_from(model).scalar()
            columns = TABLE_COLUMNS[name]
            info.append({
                "table_name": name,
                "row_count": count,
                "columns": columns
            })
        except Exception as e:
            # Handle cases where table might not exist yet or other DB errors
            info.append({
                "table_name": name,
                "error": str(e)
            })
    return info

@router.get("/stats/dashboard", summary="Get dashboard statistics — uses latest available data month")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns dashboard statistics based on the most-recent month present in the DB
    (not necessarily today's month, so it always returns meaningful data).

    Response fields:
    - orders_this_month: count of orders in the latest month
    - revenue_this_month: total revenue in the latest month
    - top_customers: top 3 customers by spend in the latest month
    - daily_orders: per-day order count for the latest month
    - monthly_sales: last 12 months of {month_label, orders, revenue} for bar chart
    - top_products_by_country: {Saudi Arabia, United Kingdom, USA} → top 5 products by qty
    - reference_month: "YYYY-MM" string of the month being shown
    - today: server date ISO string
    """
    

    # ── Helpers ───────────────────────────────────────────────────────────────
    DATE_FORMATS = [
        "%Y-%m-%d %H:%M", 
        "%Y-%m-%d %H:%M:%S",
        "%m/%d/%Y %H:%M", 
        "%m/%d/%Y %I:%M %p",
        "%d/%m/%Y %H:%M"
    ]

    def parse_dt(s: str) -> datetime | None:
        for fmt in DATE_FORMATS:
            try:
                return datetime.strptime(s.strip(), fmt)
            except ValueError:
                continue
        return None

    # ── Fetch all orders with totals ──────────────────────────────────────────
    all_rows = db.execute(
        select(
            Order.id,
            Order.invoice_date,
            Order.country,
            Customer.name.label("cust_name"),
            func.sum(OrderItem.quantity * OrderItem.unit_price).label("total_price"),
        )
        .join(Order.customer)
        .join(OrderItem)
        .group_by(Order.id, Order.invoice_date, Order.country, Customer.name)
    ).all()


    # Parse dates once
    parsed_orders = []
    for row in all_rows:
        dt = parse_dt(row.invoice_date)
        if dt:
            parsed_orders.append({
                "customer": row.cust_name,
                "total":    float(row.total_price or 0),
                "day":      dt.day,
                "month":    dt.month,
                "year":     dt.year,
                "dt":       dt,
                "country":  row.country,
            })


    if not parsed_orders:
        return {
            "orders_this_month": 0, "revenue_this_month": 0,
            "top_customers": [], "daily_orders": [],
            "monthly_sales": [], "top_products_by_country": {},
            "reference_month": None,
            "today": date.today().isoformat(),
        }

    # ── Find the most-recent (year, month) that has data ─────────────────────
    latest_dt = max(o["dt"] for o in parsed_orders)
    ref_year, ref_month = latest_dt.year, latest_dt.month

    # ── Stats for reference month ─────────────────────────────────────────────
    month_orders = [
        o for o in parsed_orders if o["year"] == ref_year and o["month"] == ref_month
    ]
    orders_count = len(month_orders)
    revenue      = round(sum(o["total"] for o in month_orders), 2)

    # Top-3 customers
    cust_spend: dict[str, float] = {}
    for o in month_orders:
        cust_spend[o["customer"]] = cust_spend.get(o["customer"], 0) + o["total"]
    top_customers = [
        {"name": n, "total": round(t, 2)}
        for n, t in sorted(cust_spend.items(), key=lambda x: x[1], reverse=True)[:3]
    ]

    # Daily orders for reference month
    daily: dict[int, int] = {}
    for o in month_orders:
        daily[o["day"]] = daily.get(o["day"], 0) + 1
    days_in_month = calendar.monthrange(ref_year, ref_month)[1]
    daily_orders = [
        {"day": d, "orders": daily.get(d, 0)}
        for d in range(1, days_in_month + 1)
    ]

    # ── Last 12 months of sales ───────────────────────────────────────────────
    # Build list of (year, month) tuples going back 12 months from latest
    months_12 = []
    y, m = ref_year, ref_month
    for _ in range(12):
        months_12.append((y, m))
        m -= 1
        if m == 0:
            m = 12
            y -= 1
    months_12.reverse()   # chronological order

    monthly_sales = []
    for (yr, mo) in months_12:
        bucket = [o for o in parsed_orders if o["year"] == yr and o["month"] == mo]
        monthly_sales.append({
            "month_label": f"{calendar.month_abbr[mo]} {yr}",
            "orders":      len(bucket),
            "revenue":     round(sum(o["total"] for o in bucket), 2),
        })

    # ── Top products per country ──────────────────────────────────────────────
    COUNTRY_MAP = {
        "Saudi Arabia":  "Saudi Arabia",
        "United Kingdom": "United Kingdom",
        "USA":           "USA",
    }

    # Fetch order-item level rows to get product titles + quantities per country
    item_rows = db.execute(
        select(
            Order.country,
            Product.title,
            func.sum(OrderItem.quantity).label("total_qty"),
        )
        .join(OrderItem, OrderItem.invoice_no == Order.id)
        .join(Product, Product.id == OrderItem.product_id)
        .where(Order.country.in_(list(COUNTRY_MAP.values())))
        .group_by(Order.country, Product.title)
    ).all()

    country_products: dict[str, list[dict]] = {k: [] for k in COUNTRY_MAP}
    # Accumulate per country
    from collections import defaultdict
    raw: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for row in item_rows:
        raw[row.country][row.title] += int(row.total_qty or 0)

    for country_key in COUNTRY_MAP:
        items = sorted(raw[country_key].items(), key=lambda x: x[1], reverse=True)[:5]
        country_products[country_key] = [
            {"product": title[:40], "qty": qty}   # truncate long titles
            for title, qty in items
        ]

    return {
        "orders_this_month":      orders_count,
        "revenue_this_month":     revenue,
        "top_customers":          top_customers,
        "daily_orders":           daily_orders,
        "monthly_sales":          monthly_sales,
        "top_products_by_country": country_products,
        "reference_month":        f"{ref_year}-{ref_month:02d}",
        "today":                  date.today().isoformat(),
    }

@router.get("/{table_name}", summary="Get paginated data of a specific table")
def get_table_data(
    table_name: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns a list of records from the specified table with pagination support.
    """
    model = TABLE_MAP.get(table_name.lower())
    if not model:
        raise HTTPException(
            status_code=404, 
            detail=f"Table '{table_name}' not found. Available tables: {', '.join(TABLE_MAP.keys())}"
        )

    try:
        total_count = db.query(func.count()).select_from(model).scalar()
        
        # Query for rows
        match table_name:
            case "orders":
                query = (
                    select(
                        Order, 
                        Customer.name.label("cust_name"), 
                        func.count(OrderItem.id).label("item_count"),
                        func.sum(OrderItem.quantity * OrderItem.unit_price).label("total_price")
                    )
                    .join(Order.customer)
                    .join(OrderItem)
                    .group_by(Order.id, Customer.name) # Grouping by ID and Name ensures compatibility
                    .offset(offset)
                    .limit(limit)
                )

                # 2. Execute and process the results
                results = db.execute(query).all()

                masked = [{
                    "id": row.Order.id,
                    "invoice_date": row.Order.invoice_date,
                    "country": row.Order.country,
                    "customer": row.cust_name, # Accessing the labeled column
                    "number_of_items": row.item_count,
                    "total": round(float(row.total_price or 0), 2) # Convert Decimal to float for JSON safety
                } for row in results]
            case "products":
                query = select(Product).offset(offset).limit(limit)
                masked = [{
                    "id": row[0].id,
                    "title": row[0].title,
                    "rate": row[0].rate,
                    "in_stock": row[0].in_stock
                } for row in db.execute(query).all()]
            case "customers":
                query = select(Customer).offset(offset).limit(limit)
                masked = [{
                        "id": row[0].id,
                        "name": row[0].name,
                        "email": row[0].email,
                        "password": f"{row[0].password[:3]}{'*' * (len(row[0].password) - 3)}"
                } for row in db.execute(query).all()]
        
        return {
            "table_name": table_name,
            "total": total_count,
            "offset": offset,
            "limit": limit,
            "data": masked
        }
    except Exception as e:
        print("ERROR FROM DATA.PY:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching data from {table_name}: {str(e)}"
        )
