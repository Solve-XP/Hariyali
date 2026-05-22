# app/repositories/dashboard_repo.py

from app.db.database import (
    expenses_collection,
    incomes_collection,
    rentals_collection,
    farms_collection,
    crop_collection,
    fertilizers_collection,
    pesticides_collection
)


class DashboardRepository:

    def __init__(self):

        self.expenses = expenses_collection
        self.incomes = incomes_collection
        self.rentals = rentals_collection
        self.farms = farms_collection
        self.crops = crop_collection
        self.fertilizers = fertilizers_collection
        self.pesticides = pesticides_collection

    async def get_dashboard_summary(
        self,
        user_id: str,
        financial_year: str | None = None
    ):

        income_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        expense_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        crop_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        fertilizer_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        pesticide_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        if (
            financial_year
            and
            financial_year != "All Financial Years"
        ):

            income_match["financial_year"] = financial_year
            expense_match["financial_year"] = financial_year
            crop_match["financial_year"] = financial_year
            fertilizer_match["financial_year"] = financial_year
            pesticide_match["financial_year"] = financial_year

        income_pipeline = [
            {
                "$match": income_match
            },
            {
                "$group": {
                    "_id": None,
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        expense_pipeline = [
            {
                "$match": expense_match
            },
            {
                "$group": {
                    "_id": None,
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        income_result = await self.incomes.aggregate(
            income_pipeline
        ).to_list(1)

        expense_result = await self.expenses.aggregate(
            expense_pipeline
        ).to_list(1)

        total_income = (
            income_result[0]["total"]
            if income_result else 0
        )

        total_expenses = (
            expense_result[0]["total"]
            if expense_result else 0
        )

        total_farms = await self.farms.count_documents(
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        total_crops = await self.crops.count_documents(
            crop_match
        )

        total_rentals = await self.rentals.count_documents(
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        total_fertilizers = await self.fertilizers.count_documents(
            fertilizer_match
        )

        total_pesticides = await self.pesticides.count_documents(
            pesticide_match
        )

        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_profit": total_income - total_expenses,
            "total_farms": total_farms,
            "total_crops": total_crops,
            "total_rentals": total_rentals,
            "total_fertilizers": total_fertilizers,
            "total_pesticides": total_pesticides
        }

    async def get_financial_analytics(
        self,
        user_id: str,
        financial_year: str | None = None
    ):

        income_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        expense_match = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        is_all_years = (
            not financial_year
            or
            financial_year == "All Financial Years"
        )

        # ---------------------------------------------------
        # ALL FINANCIAL YEARS → GROUP BY YEAR
        # ---------------------------------------------------

        if is_all_years:

            income_pipeline = [
                {
                    "$match": income_match
                },
                {
                    "$group": {
                        "_id": {
                            "$year": "$income_date"
                        },
                        "total": {
                            "$sum": "$amount"
                        }
                    }
                }
            ]

            expense_pipeline = [
                {
                    "$match": expense_match
                },
                {
                    "$group": {
                        "_id": {
                            "$year": "$expense_date"
                        },
                        "total": {
                            "$sum": "$amount"
                        }
                    }
                }
            ]

            income_result = await self.incomes.aggregate(
                income_pipeline
            ).to_list(None)

            expense_result = await self.expenses.aggregate(
                expense_pipeline
            ).to_list(None)

            income_map = {
                item["_id"]: item["total"]
                for item in income_result
            }

            expense_map = {
                item["_id"]: item["total"]
                for item in expense_result
            }

            all_years = sorted(
                list(
                    set(
                        income_map.keys()
                        |
                        expense_map.keys()
                    )
                )
            )

            final_data = []

            for year in all_years:

                income = income_map.get(year, 0)

                expenses = expense_map.get(year, 0)

                final_data.append({
                    "year": year,
                    "income": income,
                    "expenses": expenses,
                    "profit": income - expenses
                })

            return final_data

        # ---------------------------------------------------
        # SPECIFIC FINANCIAL YEAR → GROUP BY MONTH
        # ---------------------------------------------------

        income_match["financial_year"] = financial_year

        expense_match["financial_year"] = financial_year

        months_map = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }

        income_pipeline = [
            {
                "$match": income_match
            },
            {
                "$group": {
                    "_id": {
                        "$month": "$income_date"
                    },
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        expense_pipeline = [
            {
                "$match": expense_match
            },
            {
                "$group": {
                    "_id": {
                        "$month": "$expense_date"
                    },
                    "total": {
                        "$sum": "$amount"
                    }
                }
            }
        ]

        income_result = await self.incomes.aggregate(
            income_pipeline
        ).to_list(None)

        expense_result = await self.expenses.aggregate(
            expense_pipeline
        ).to_list(None)

        income_map = {
            item["_id"]: item["total"]
            for item in income_result
        }

        expense_map = {
            item["_id"]: item["total"]
            for item in expense_result
        }

        final_data = []

        for month_number in range(1, 13):

            income = income_map.get(month_number, 0)

            expenses = expense_map.get(month_number, 0)

            final_data.append({
                "month": months_map[month_number],
                "income": income,
                "expenses": expenses,
                "profit": income - expenses
            })

        return final_data

    async def get_recent_incomes(
        self,
        user_id: str,
        limit: int = 5
    ):

        cursor = self.incomes.find(
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        ).sort(
            "income_date",
            -1
        ).limit(limit)

        data = await cursor.to_list(limit)

        for item in data:

            item["_id"] = str(item["_id"])

            if "income_date" in item:
                item["income_date"] = str(
                    item["income_date"]
                )

            if "created_at" in item:
                item["created_at"] = str(
                    item["created_at"]
                )

            if "updated_at" in item:
                item["updated_at"] = str(
                    item["updated_at"]
                )

        return data

    async def get_recent_expenses(
        self,
        user_id: str,
        limit: int = 5
    ):

        cursor = self.expenses.find(
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        ).sort(
            "expense_date",
            -1
        ).limit(limit)

        data = await cursor.to_list(limit)

        for item in data:

            item["_id"] = str(item["_id"])

            if "expense_date" in item:
                item["expense_date"] = str(
                    item["expense_date"]
                )

            if "created_at" in item:
                item["created_at"] = str(
                    item["created_at"]
                )

            if "updated_at" in item:
                item["updated_at"] = str(
                    item["updated_at"]
                )

        return data

    async def get_recent_rentals(
        self,
        user_id: str,
        limit: int = 5
    ):

        cursor = self.rentals.find(
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        ).sort(
            "created_at",
            -1
        ).limit(limit)

        data = await cursor.to_list(limit)

        for item in data:

            item["_id"] = str(item["_id"])

            if "created_at" in item:
                item["created_at"] = str(
                    item["created_at"]
                )

            if "updated_at" in item:
                item["updated_at"] = str(
                    item["updated_at"]
                )

        return data

    async def get_expense_breakdown(
        self,
        user_id: str,
        financial_year: str | None = None
    ):

        match_query = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        if (
            financial_year
            and
            financial_year != "All Financial Years"
        ):

            match_query["financial_year"] = financial_year

        pipeline = [
            {
                "$match": match_query
            },
            {
                "$group": {
                    "_id": "$category",
                    "total": {
                        "$sum": "$amount"
                    }
                }
            },
            {
                "$sort": {
                    "total": -1
                }
            }
        ]

        result = await self.expenses.aggregate(
            pipeline
        ).to_list(None)

        final_data = []

        for item in result:

            final_data.append({
                "category": item["_id"] or "Unknown",
                "total": item["total"]
            })

        return final_data

    async def get_income_breakdown(
        self,
        user_id: str,
        financial_year: str | None = None
    ):

        match_query = {
            "user_id": user_id,
            "is_deleted": {
                "$ne": True
            }
        }

        if (
            financial_year
            and
            financial_year != "All Financial Years"
        ):

            match_query["financial_year"] = financial_year

        pipeline = [
            {
                "$match": match_query
            },
            {
                "$addFields": {
                    "crop_object_id": {
                        "$toObjectId": "$crop_id"
                    }
                }
            },
            {
                "$lookup": {
                    "from": "crops",
                    "localField": "crop_object_id",
                    "foreignField": "_id",
                    "as": "crop"
                }
            },
            {
                "$unwind": {
                    "path": "$crop",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$group": {
                    "_id": "$crop.crop_name",
                    "total": {
                        "$sum": "$amount"
                    }
                }
            },
            {
                "$sort": {
                    "total": -1
                }
            }
        ]

        result = await self.incomes.aggregate(
            pipeline
        ).to_list(None)

        final_data = []

        for item in result:

            final_data.append({
                "crop_name": item["_id"] or "Unknown Crop",
                "total": item["total"]
            })

        return final_data

    async def get_filter_options(
        self,
        user_id: str
    ):

        income_years = await self.incomes.distinct(
            "financial_year",
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        expense_years = await self.expenses.distinct(
            "financial_year",
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        crop_years = await self.crops.distinct(
            "financial_year",
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        fertilizer_years = await self.fertilizers.distinct(
            "financial_year",
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        pesticide_years = await self.pesticides.distinct(
            "financial_year",
            {
                "user_id": user_id,
                "is_deleted": {
                    "$ne": True
                }
            }
        )

        all_years = list(set(
            income_years
            +
            expense_years
            +
            crop_years
            +
            fertilizer_years
            +
            pesticide_years
        ))

        all_years = sorted(all_years)

        return {
            "financial_years": [
                "All Financial Years",
                *all_years
            ],
            "expense_categories": [
                "fertilizer",
                "pesticide",
                "seeds",
                "labor",
                "diesel",
                "transport",
                "equipment",
                "electricity",
                "water",
                "maintenance",
                "other"
            ]
        }