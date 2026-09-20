from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """
    Convert a plain password into a secure Argon2id hash.
    """
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """
    Check whether the entered password matches the stored hash.
    """
    try:
        return password_hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False