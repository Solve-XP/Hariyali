import "./Crops.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { FarmsService, CropsService } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Table from "../components/Table";
import { IconPlus, IconCrop } from "../components/Icons";
import EmptyState from "../components/EmptyState";

const EMPTY = { farm_id: "", name: "", season: "", sowing_date: "", expected_harvest: "" };

export default function Crops() {
  const { t } = useTranslation();
  const { pushToast } = useApp();
  const [farms,  setFarms]  = useState([]);
  const [list,   setList]   = useState([]);
  const [filter, setFilter] = useState("all");
  const [form,   setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FarmsService.list().then((r) => setFarms(r.data ?? [])).catch(() => {});
    loadCrops();
  }, []);

  const loadCrops = () =>
    CropsService.list().then((r) => setList(r.data ?? [])).catch(() => {});

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const filtered = filter === "all" ? list : list.filter((c) => c.farm_id === filter);

  const farmName = (id) => farms.find((f) => f.id === id)?.name ?? "—";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farm_id || !form.name) { pushToast(t("messages.VALIDATION_ERROR"), "error"); return; }
    setLoading(true);
    try {
      await CropsService.create(form);
      pushToast(t("messages.CROP_ADDED_SUCCESS"));
      setForm(EMPTY);
      loadCrops();
    } catch { pushToast(t("messages.GENERIC_ERROR"), "error"); }
    finally { setLoading(false); }
  };

  const columns = [
    { key: "name",     header: t("crops.name"),             render: (r) => <strong>{r.name}</strong> },
    { key: "farm",     header: t("crops.farm"),             render: (r) => farmName(r.farm_id) },
    { key: "season",   header: t("crops.season"),           render: (r) => r.season || "—" },
    { key: "sowing",   header: t("crops.sowing_date"),      render: (r) => r.sowing_date || "—" },
    { key: "harvest",  header: t("crops.expected_harvest"), render: (r) => r.expected_harvest || "—" },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("crops.title")}</h2>
        <p className="page__subtitle">{t("crops.subtitle")}</p>
      </div>

      <Card>
        <h3 className="section__title" style={{ marginBottom: "var(--space-4)" }}>{t("crops.add_title")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Select label={t("crops.select_farm")} value={form.farm_id} onChange={set("farm_id")}>
              <option value="">{t("common.select_option")}</option>
              {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </Select>
            <Input label={t("crops.name")}             placeholder={t("crops.name_placeholder")}   value={form.name}              onChange={set("name")} />
            <Input label={t("crops.season")}           placeholder={t("crops.season_placeholder")} value={form.season}            onChange={set("season")} />
            <Input label={t("crops.sowing_date")}      type="date"                                  value={form.sowing_date}       onChange={set("sowing_date")} />
            <Input label={t("crops.expected_harvest")} type="date"                                  value={form.expected_harvest}  onChange={set("expected_harvest")} />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}><IconPlus /> {t("common.add")}</Button>
          </div>
        </form>
      </Card>

      <div className="page__section">
        <div className="section__header">
          <h3 className="section__title">{t("crops.list_title")}</h3>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="all">{t("crops.all_farms")}</option>
            {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<IconCrop />} message={t("crops.empty")} />
        ) : (
          <Table columns={columns} rows={filtered} rowKey={(r) => r.id} emptyMessage={t("crops.empty")} />
        )}
      </div>
    </div>
  );
}
