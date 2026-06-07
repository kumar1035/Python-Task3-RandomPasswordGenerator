"""
Input validation for all /api/generate and /api/strength requests.
Returns (True, None) on success, (False, error_message) on failure.
"""

MIN_LENGTH = 4
MAX_LENGTH = 128
MAX_COUNT = 20


def validate_generate_request(data: dict) -> tuple[bool, str | None]:
    length = data.get("length")
    count = data.get("count", 1)
    char_types = {
        "uppercase": data.get("uppercase", True),
        "lowercase": data.get("lowercase", True),
        "numbers": data.get("numbers", True),
        "symbols": data.get("symbols", False),
    }

    if not isinstance(length, int) or not (MIN_LENGTH <= length <= MAX_LENGTH):
        return False, f"length must be an integer between {MIN_LENGTH} and {MAX_LENGTH}"

    if not isinstance(count, int) or not (1 <= count <= MAX_COUNT):
        return False, f"count must be an integer between 1 and {MAX_COUNT}"

    if not any(char_types.values()):
        return False, "At least one character type must be selected"

    custom_exclude = data.get("custom_exclude", "")
    if not isinstance(custom_exclude, str) or len(custom_exclude) > 50:
        return False, "custom_exclude must be a string of at most 50 characters"

    return True, None


def validate_strength_request(data: dict) -> tuple[bool, str | None]:
    password = data.get("password", "")
    if not isinstance(password, str) or len(password) == 0:
        return False, "password must be a non-empty string"
    if len(password) > MAX_LENGTH * 2:
        return False, "password too long"
    return True, None
