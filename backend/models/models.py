import uuid
from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, Text, Boolean, DateTime, Enum, func
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass

# ==========================================
# 1. USER MANAGEMENT & AUTHENTICATION
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(Enum('employee', 'manager', 'admin', name='user_role'), default='employee')
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

# ==========================================
# 2. CONVERSATION MANAGEMENT
# ==========================================

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255))
    prompt = Column(String(255))
    is_archived = Column(Boolean, default=False)
    text = Column(Text)
    sql = Column(String(500))
    data = Column(JSONB, default={})
    sql_generation_time = Column(Float)
    text_generation_time = Column(Float)
    data_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", back_populates="conversations")

# ==========================================
# 3. ECOMMERCE DATA
# ==========================================

class Customer(Base):
    __tablename__ = "customers"

    id        = Column(Integer, primary_key=True)          # original CustomerID
    name      = Column(String(120), nullable=False)
    email     = Column(String(120), nullable=False)
    password  = Column(String(120), nullable=False)

    orders = relationship("Order", back_populates="customer")

    def __repr__(self):
        return f"<Customer id={self.id} name={self.name!r}>"


class Product(Base):
    __tablename__ = "products"

    id       = Column(String(64), primary_key=True)         # random unique id
    title    = Column(Text, nullable=False, unique=True)    # from Description
    rate     = Column(Float, nullable=False)                # random 0.0 - 5.0
    in_stock = Column(Integer, nullable=False)              # random 0 - 125

    order_items = relationship("OrderItem", back_populates="product")

    def __repr__(self):
        return f"<Product id={self.id} title={self.title!r}>"


class Order(Base):
    __tablename__ = "orders"

    id           = Column(String(20), primary_key=True)     # InvoiceNo
    invoice_date = Column(String(30), nullable=False)
    country      = Column(String(100), nullable=False)

    customer_id  = Column(Integer, ForeignKey("customers.id"), nullable=False)

    customer = relationship("Customer", back_populates="orders")
    items    = relationship("OrderItem", back_populates="order")

    def __repr__(self):
        return f"<Order id={self.id}>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    invoice_no = Column(String(20), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(64), ForeignKey("products.id"),  nullable=False)
    quantity   = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    order   = relationship("Order", back_populates="items")
    product = relationship("Product",  back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem id={self.id} invoice={self.invoice_no!r}>"
