''' def build_search_query(
    field: str,
    search: str
):

    if not search:
        return {}

    return {
        field: {
            "$regex": search,
            "$options": "i"
        }
    }'''


def build_search_query(
    fields: list,
    search: str
):

    if not search:
        return {}

    return {
        "$or": [
            {
                field: {
                    "$regex": search,
                    "$options": "i"
                }
            }
            for field in fields
        ]
    }