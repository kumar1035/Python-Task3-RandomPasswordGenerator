"""
Core password generation using secrets module (CSPRNG).

secrets.choice() draws from os.urandom() — cryptographically secure,
suitable for generating credentials.  Never use random.choice() here.
"""

import secrets
import string


AMBIGUOUS = set("0O1lI|`")

CHARSETS = {
    "uppercase": string.ascii_uppercase,
    "lowercase": string.ascii_lowercase,
    "numbers":   string.digits,
    "symbols":   string.punctuation,
}


def _build_pool(options: dict) -> str:
    pool = ""
    for key, chars in CHARSETS.items():
        if options.get(key, False):
            pool += chars

    if options.get("exclude_ambiguous", False):
        pool = "".join(c for c in pool if c not in AMBIGUOUS)

    custom_exclude = set(options.get("custom_exclude", ""))
    if custom_exclude:
        pool = "".join(c for c in pool if c not in custom_exclude)

    return pool


def _guaranteed_chars(options: dict, pool: str) -> list[str]:
    """Return one character from each selected charset to guarantee inclusion."""
    guaranteed = []
    for key, chars in CHARSETS.items():
        if options.get(key, False):
            filtered = "".join(c for c in chars if c in pool)
            if filtered:
                guaranteed.append(secrets.choice(filtered))
    return guaranteed


def generate_password(length: int, options: dict) -> str:
    pool = _build_pool(options)
    if not pool:
        raise ValueError("Character pool is empty after applying exclusions")

    no_repeat = options.get("no_repeat", False)
    if no_repeat and length > len(pool):
        raise ValueError(
            f"Cannot generate a {length}-char password without repeats "
            f"from a pool of only {len(pool)} characters"
        )

    guaranteed = _guaranteed_chars(options, pool)

    if no_repeat:
        remaining_pool = list(pool)
        for c in guaranteed:
            if c in remaining_pool:
                remaining_pool.remove(c)
        remaining = _sample_no_repeat(remaining_pool, length - len(guaranteed))
    else:
        remaining = [secrets.choice(pool) for _ in range(length - len(guaranteed))]

    combined = guaranteed + remaining
    # Shuffle with CSPRNG so guaranteed chars don't always appear at the start
    _secure_shuffle(combined)
    return "".join(combined)


def generate_multiple(length: int, count: int, options: dict) -> list[str]:
    return [generate_password(length, options) for _ in range(count)]


def _sample_no_repeat(pool: list, k: int) -> list[str]:
    """Fisher-Yates partial shuffle using secrets for truly random sampling."""
    pool = list(pool)
    result = []
    for _ in range(k):
        idx = secrets.randbelow(len(pool))
        result.append(pool[idx])
        pool[idx] = pool[-1]
        pool.pop()
    return result


def _secure_shuffle(lst: list) -> None:
    """In-place Fisher-Yates shuffle using secrets.randbelow."""
    n = len(lst)
    for i in range(n - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        lst[i], lst[j] = lst[j], lst[i]
