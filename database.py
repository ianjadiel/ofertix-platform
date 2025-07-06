# Nuevo archivo para manejo de base de datos
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    name = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_verified = Column(Boolean, default=False)

class Store(Base):
    __tablename__ = 'stores'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    api_endpoint = Column(String(255))
    commission_rate = Column(Float, default=0.05)
    payment_info = Column(Text)  # JSON con datos de pago
    is_active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    store_id = Column(Integer)
    image_url = Column(String(500))
    description = Column(Text)
    category = Column(String(50))
    stock_status = Column(String(20), default='available')
    last_updated = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    product_id = Column(Integer)
    quantity = Column(Integer, default=1)
    total_amount = Column(Float)
    commission_amount = Column(Float)
    store_payment = Column(Float)
    status = Column(String(20), default='pending')
    payment_method = Column(String(50))
    shipping_address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime)