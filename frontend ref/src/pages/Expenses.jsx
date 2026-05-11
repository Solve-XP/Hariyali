import "./Expenses.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { CropsService, ExpensesService, EXPENSE_TYPES } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Table from "../components/Table";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import { IconPlus, IconExpense } from "../components/Icons";
import EmptyState from "../components/EmptyState";

const EMPTY = { crop_id: "", type: EXPENSE_TYPES[0], amount: "", date: "" };

export default function Expenses() {
  const { t } = useTranslation();
  const { pushToast } = useApp();
  const [crops,    setCrops]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [form,     setForm]     = useState(EMPTY);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    CropsService.list().then((r) => setCrops(r.data ?? [])).catch(() => {});
    loadExpenses();
  }, []);

  const loadExpenses = () =>
    ExpensesService.list().then((r) => setExpenses(r.data ?? [])).catch(() => {});

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const filtered = filter === "all" ? expenses : expenses.filter((e) => e.crop_id === filter);
  const total    = filtered.reduce((s, e) => s + e.amount, 0);
  const cropName = (id) => crops.find((c) => c.id === id)?.name ?? "—";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { crop_id, type, amount, date } = form;
    if (!crop_id || !type || !amount || !date) { pushToast(t("messages.VALIDATION_ERROR"), "error"); return; }
    setLoading(true);
    try {
      await ExpensesService.create({ ...form, amount: parseFloat(form.amount) });
      pushToast(t("messages.EXPENSE_ADDED_SUCCESS"));
      setForm(EMPTY);
      loadExpenses();
    } catch { pushToast(t("messages.GENERIC_ERROR"), "error"); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: "crop",   header: t("crops.name"),    render: (r) => cropName(r.crop_id) },
    { key: "type",   header: t("expenses.type"), render: (r) => <Badge variant="neutral">{t(`expenses.types.${r.type}`)}</Badge> },
    { key: "amount", header: t("common.amount"), render: (r) => `${t("common.currency")}${r.amount.toLocaleString()}` },
    { key: "date",   header: t("common.date"),   render: (r) => r.date },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("expenses.title")}</h2>
        <p className="page__subtitle">{t("expenses.subtitle")}</p>
      </div>

      <Card>
        <h3 className="section__title" style={{ marginBottom: "var(--space-4)" }}>{t("expenses.add_title")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Select label={t("expenses.select_crop")} value={form.crop_id} onChange={set("crop_id")}>
              <option value="">{t("common.select_option")}</option>
              {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label={t("expenses.type")} value={form.type} onChange={set("type")}>
              {EXPENSE_TYPES.map((tp) => <option key={tp} value={tp}>{t(`expenses.types.${tp}`)}</option>)}
            </Select>
            <Input label={t("common.amount")} type="number" min="0" placeholder={t("expenses.amount_placeholder")}
              value={form.amount} onChange={set("amount")} />
            <Input label={t("common.date")} type="date" value={form.date} onChange={set("date")} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}><IconPlus /> {t("common.add")}</Button>
          </div>
        </form>
      </Card>

      <div className="expenses__summary">
        <StatCard label={t("expenses.total_for_crop")} value={`${t("common.currency")}${total.toLocaleString()}`}
          hint={`${filtered.length} records`} icon={<IconExpense size={20} />} iconVariant="accent" />
      </div>

      <div className="page__section">
        <div className="section__header">
          <h3 className="section__title">{t("expenses.list_title")}</h3>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 220 }}>
            <option value="all">{t("common.all")}</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<IconExpense />} message={t("expenses.empty")} />
        ) : (
          <Table columns={columns} rows={filtered} rowKey={(r) => r.id} emptyMessage={t("expenses.empty")} />
        )}
      </div>
    </div>
  );
}
