from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from db.session import get_db
from models.models import Order, Product, Customer, User, OrderItem
from src.auth import get_current_user

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
