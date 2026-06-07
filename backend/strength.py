"""
Password strength evaluation.

Entropy formula: E = L * log2(N)
  L = password length
  N = size of the character pool actually used in the password

Score bands:
  0-25  → Very Weak
  26-50 → Weak
  51-60 → Fair
  61-80 → Strong
  81+   → Very Strong
"""

import math
import re
import string


COMMON_PASSWORDS = {
    "password", "123456", "password1", "qwerty", "abc123",
    "letmein", "monkey", "1234567890", "iloveyou", "admin",
    "welcome", "login", "pass", "master", "hello",
}

SEQUENTIAL_RUNS = re.compile(r"(.)\1{2,}")  # 3+ repeated chars


def _pool_size(password: str) -> int:
    n = 0
    if any(c in string.ascii_lowercase for c in password):
        n += 26
    if any(c in string.ascii_uppercase for c in password):
        n += 26
    if any(c in string.digits for c in password):
        n += 10
    if any(c in string.punctuation for c in password):
        n += 32
    return n or 1


def _entropy(password: str) -> float:
    n = _pool_size(password)
    return len(password) * math.log2(n)


def _penalties(password: str) -> list[str]:
    warnings = []
    lower = password.lower()

    if lower in COMMON_PASSWORDS:
        warnings.append("This is a commonly used password")

    if SEQUENTIAL_RUNS.search(password):
        warnings.append("Contains 3+ repeated consecutive characters")

    if re.search(r"(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def)", lower):
        warnings.append("Contains sequential character pattern")

    if len(set(password)) < len(password) * 0.5:
        warnings.append("Too many repeated characters")

    return warnings


def evaluate(password: str) -> dict:
    entropy = _entropy(password)
    warnings = _penalties(password)

    if warnings:
        entropy *= 0.7

    if entropy <= 25:
        label, score = "Very Weak", max(5, int(entropy))
    elif entropy <= 50:
        label, score = "Weak", int(entropy)
    elif entropy <= 60:
        label, score = "Fair", int(entropy)
    elif entropy <= 80:
        label, score = "Strong", int(entropy)
    else:
        label, score = "Very Strong", min(100, int(entropy))

    score = min(score, 100)

    return {
        "label":   label,
        "score":   score,
        "entropy": round(entropy, 2),
        "length":  len(password),
        "warnings": warnings,
        "has_upper":   any(c in string.ascii_uppercase for c in password),
        "has_lower":   any(c in string.ascii_lowercase for c in password),
        "has_digit":   any(c in string.digits for c in password),
        "has_symbol":  any(c in string.punctuation for c in password),
    }
