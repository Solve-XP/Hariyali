import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { IconExpense, IconFarm, IconCrop, IconPlus, IconRental } from "../components/Icons";
import { FarmsService, CropsService, ExpensesService } from "../services/api";

export default function Dashboard() {
  const { t } = useTranslation();
  const [farms,    setFarms]    = useState([]);
  const [crops,    setCrops]    = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    FarmsService.list().then((r) => setFarms(r.data ?? [])).catch(() => {});
    CropsService.list().then((r) => setCrops(r.data ?? [])).catch(() => {});
    ExpensesService.list().then((r) => setExpenses(r.data ?? [])).catch(() => {});
  }, []);

  const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);
  const totalAcres   = farms.reduce((s, f) => s + f.acres, 0);
  const recent = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const cropName = (id) => crops.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("dashboard.title")}</h2>
        <p className="page__subtitle">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid--4">
        <StatCard label={t("dashboard.total_expenses")} value={`${t("common.currency")}${totalExpense.toLocaleString()}`}
          hint={t("dashboard.expenses_unit")} icon={<IconExpense size={20} />} iconVariant="accent" />
        <StatCard label={t("dashboard.total_farms")} value={farms.length}
          hint={`${totalAcres} ${t("farms.acres").toLowerCase()}`} icon={<IconFarm size={20} />} />
        <StatCard label={t("dashboard.total_crops")} value={crops.length}
          hint={t("dashboard.crops_unit")} icon={<IconCrop size={20} />} iconVariant="info" />
        <StatCard label={t("dashboard.active_listings")} value={expenses.length}
          hint={t("dashboard.entries_recorded")} icon={<IconRental size={20} />} />
      </div>

      <div className="grid grid--2-1">
        <Card>
          <div className="section__header">
            <div>
              <h3 className="section__title">{t("dashboard.recent_activity")}</h3>
              <p className="section__subtitle">{t("dashboard.recent_activity_sub")}</p>
            </div>
            <Link to="/expenses"><Button variant="ghost" size="sm">{t("common.view")}</Button></Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty">{t("common.no_data")}</div>
          ) : (
            <div className="activity-list">
              {recent.map((e) => (
                <div key={e.id} className="activity-item">
                  <div className="activity-item__icon"><IconExpense size={16} /></div>
                  <div className="activity-item__body">
                    <div className="activity-item__title">{cropName(e.crop_id)}</div>
                    <div className="activity-item__sub">
                      <Badge variant="neutral">{t(`expenses.types.${e.type}`)}</Badge> · {e.date}
                    </div>
                  </div>
                  <div className="activity-item__amount">{t("common.currency")}{e.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="section__header"><h3 className="section__title">{t("dashboard.quick_actions")}</h3></div>
          <div className="dashboard__quick-actions">
            <Link to="/farms">    <Button variant="primary"   block><IconPlus /> {t("dashboard.add_farm")}</Button></Link>
            <Link to="/crops">    <Button variant="secondary" block><IconPlus /> {t("dashboard.add_crop")}</Button></Link>
            <Link to="/expenses"> <Button variant="accent"    block><IconPlus /> {t("dashboard.add_expense")}</Button></Link>
            <Link to="/rental">   <Button variant="ghost"     block><IconRental size={16} /> {t("nav.rental")}</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
