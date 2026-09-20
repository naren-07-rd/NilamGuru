import hashlib
import secrets
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from database.models import User, AuthSession
from utils.password import hash_password, verify_password
from schemas.auth import RegisterRequest, LoginRequest


def register_user(db: Session, data: RegisterRequest) -> User:

    # 1. Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    # 2. Hash the password
    password_hash = hash_password(data.password)

    # 3. Create a new User object
    new_user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=password_hash,
        role="uzhavali",
        is_verified=False,
    )

    # 4. Add user to database
    db.add(new_user)

    # 5. Save changes
    db.commit()

    # 6. Refresh object to get generated ID
    db.refresh(new_user)

    return new_user
def login_user(db: Session, email: str, password: str) -> User:

    # 1. Find user by email
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # 2. User doesn't exist
    if not user:
        raise ValueError("Invalid email or password")

    # 3. Verify entered password
    password_is_valid = verify_password(
        password,
        user.password_hash
    )

    # 4. Password is incorrect
    if not password_is_valid:
        raise ValueError("Invalid email or password")

    # 5. Login successful
    return user

def create_session(db: Session, user: User) -> str:

    # Generate a cryptographically secure random token
    session_token = secrets.token_urlsafe(32)

    # Never store the raw token in the database
    token_hash = hashlib.sha256(
        session_token.encode()
    ).hexdigest()

    # Session expires after 7 days
    expires_at = datetime.utcnow() + timedelta(days=7)

    new_session = AuthSession(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False
    )

    db.add(new_session)
    db.commit()

    return session_token

def get_user_from_session(
    db: Session,
    session_token: str
) -> User | None:

    token_hash = hashlib.sha256(
        session_token.encode()
    ).hexdigest()

    session = (
        db.query(AuthSession)
        .filter(
            AuthSession.token_hash == token_hash,
            AuthSession.revoked == False
        )
        .first()
    )

    if not session:
        return None

    if session.expires_at < datetime.utcnow():
        session.revoked = True
        db.commit()
        return None

    return session.user

def revoke_session(
    db: Session,
    session_token: str
) -> None:

    token_hash = hashlib.sha256(
        session_token.encode()
    ).hexdigest()

    session = (
        db.query(AuthSession)
        .filter(AuthSession.token_hash == token_hash)
        .first()
    )

    if session:
        session.revoked = True
        db.commit()