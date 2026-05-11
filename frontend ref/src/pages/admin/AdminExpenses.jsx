import "./AdminExpenses.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExpensesService } from "../../services/api";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import EmptyState from "../../components/EmptyState";
import { IconExpense } from "../../components/Icons";

export default function AdminExpenses() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);

  useEffect(() => {
    ExpensesService.listAll().then((r) => setList(r.data ?? [])).catch(() => {});
  }, []);

  const total = list.reduce((s, e) => s + e.amount, 0);

  const columns = [
    { key: "crop",   header: t("crops.name"),    render: (r) => r.crop_id },
    { key: "type",   header: t("expenses.type"), render: (r) => <Badge variant="neutral">{t(`expenses.types.${r.type}`)}</Badge> },
    { key: "amount", header: t("common.amount"), render: (r) => `${t("common.currency")}${r.amount.toLocaleString()}` },
    { key: "date",   header: t("common.date"),   render: (r) => r.date },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.expenses_title")}</h2>
        <p className="page__subtitle">{t("admin.expenses_subtitle")}</p>
      </div>
      <div className="admin-expenses__total">
        <span>{t("common.total")}:</span>
        <strong>{t("common.currency")}{total.toLocaleString()}</strong>
        <span>({list.length} records)</span>
      </div>
      <div className="page__section">
        {list.length === 0 ? (
          <EmptyState icon={<IconExpense />} message={t("common.no_data")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("common.no_data")} />
        )}
      </div>
    </div>
  );
}
