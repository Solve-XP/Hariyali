from datetime import (
    date,
    datetime
)

import re


FINANCIAL_YEAR_REGEX = r"^\d{4}-\d{4}$"


def get_current_financial_year() -> str:

    current_date = datetime.utcnow()

    year = current_date.year

    if current_date.month >= 4:
        return f"{year}-{year + 1}"

    return f"{year - 1}-{year}"


def get_financial_year_from_date(
    input_date: date
) -> str:

    year = input_date.year

    if input_date.month >= 4:
        return f"{year}-{year + 1}"

    return f"{year - 1}-{year}"


def validate_financial_year(
    financial_year: str
) -> bool:

    if not re.match(
        FINANCIAL_YEAR_REGEX,
        financial_year
    ):
        return False

    start_year, end_year = map(
        int,
        financial_year.split("-")
    )

    return end_year == start_year + 1