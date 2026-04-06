import re
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    is_active: Optional[bool] = True
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8 or len(v) > 16:
            raise ValueError('Password must be 8 to 16 characters long.')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must include at least one capital letter.')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must include at least one number.')
        if not re.search(r'[^A-Za-z0-9]', v):
            raise ValueError('Password must include at least one special character (shape).')
        return v

# Properties to return via API
class User(UserBase):
    id: int

    class Config:
        from_attributes = True
