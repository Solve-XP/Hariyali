import "./Farms.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { FarmsService } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Table from "../components/Table";
import { IconPlus, IconFarm } from "../components/Icons";
import EmptyState from "../components/EmptyState";

const EMPTY = { name: "", acres: "", location: "", soil_type: "" };

export default function Farms() {
  const { t } = useTranslation();
  const { pushToast } = useApp();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => FarmsService.list().then((r) => setList(r.data ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, acres, location } = form;
    if (!name || !acres || !location) { pushToast(t("messages.VALIDATION_ERROR"), "error"); return; }
    setLoading(true);
    try {
      await FarmsService.create({ ...form, acres: parseFloat(form.acres) });
      pushToast(t("messages.FARM_ADDED_SUCCESS"));
      setForm(EMPTY);
      load();
    } catch { pushToast(t("messages.GENERIC_ERROR"), "error"); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: "name",      header: t("farms.name"),      render: (r) => <strong>{r.name}</strong> },
    { key: "acres",     header: t("farms.acres"),     render: (r) => r.acres },
    { key: "location",  header: t("farms.location"),  render: (r) => r.location },
    { key: "soil_type", header: t("farms.soil_type"), render: (r) => r.soil_type || "—" },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("farms.title")}</h2>
        <p className="page__subtitle">{t("farms.subtitle")}</p>
      </div>

      <Card>
        <h3 className="section__title" style={{ marginBottom: "var(--space-4)" }}>{t("farms.add_title")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input label={t("farms.name")}      placeholder={t("farms.name_placeholder")}     value={form.name}      onChange={set("name")} />
            <Input label={t("farms.acres")}     placeholder={t("farms.acres_placeholder")}    value={form.acres}     onChange={set("acres")}     type="number" min="0" step="0.01" />
            <Input label={t("farms.location")}  placeholder={t("farms.location_placeholder")} value={form.location}  onChange={set("location")} />
            <Input label={t("farms.soil_type")} placeholder={t("farms.soil_placeholder")}     value={form.soil_type} onChange={set("soil_type")} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              <IconPlus /> {t("common.add")}
            </Button>
          </div>
        </form>
      </Card>

      <div className="page__section">
        <div className="section__header">
          <h3 className="section__title">{t("farms.list_title")}</h3>
        </div>
        {list.length === 0 ? (
          <EmptyState icon={<IconFarm />} message={t("farms.empty")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("farms.empty")} />
        )}
      </div>
    </div>
  );
}
