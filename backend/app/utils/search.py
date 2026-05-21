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


# def build_search_query(
#     fields: list,
#     search: str
# ):

#     if not search:
#         return {}

#     return {
#         "$or": [
#             {
#                 field: {
#                     "$regex": search,
#                     "$options": "i"
#                 }
#             }
#             for field in fields
#         ]
#     }

def build_search_query(
    fields: list,
    search: str
):

    if (
        not search
        or
        not search.strip()
    ):

        return {}

    search = search.strip()

    or_conditions = []

    for field in fields:

        or_conditions.append({
            field: {
                "$regex": search,
                "$options": "i"
            }
        })

    return {
        "$or": or_conditions
    }