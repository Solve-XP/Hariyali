import re


def normalize_text(value: str) -> str:

    if not value:
        return ""

    value = value.strip()

    value = re.sub(
        r"\s+",
        " ",
        value
    )

    return value.lower()