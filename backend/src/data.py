from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from db.session import get_db
from models.models import Order, Product, Customer, User
from src.auth import get_current_user

router = APIRouter()

TABLE_MAP = {
    "orders": Order,
    "products": Product,
    "customers": Customer
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
            columns = [c.name for c in model.__table__.columns]
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
        query = select(model).offset(offset).limit(limit)
        results = db.execute(query).scalars().all()
        
        return {
            "table_name": table_name,
            "total": total_count,
            "offset": offset,
            "limit": limit,
            "data": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching data from {table_name}: {str(e)}"
        )
