def build_search_query(
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
    }