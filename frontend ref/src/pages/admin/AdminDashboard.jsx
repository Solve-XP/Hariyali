import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "../../components/StatCard";
import { IconFarm, IconCrop, IconUsers, IconRental } from "../../components/Icons";
import { FarmsService, CropsService, UsersService, EquipmentService } from "../../services/api";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ users: 0, farms: 0, crops: 0, equipment: 0 });

  useEffect(() => {
    Promise.allSettled([
      UsersService.list(),
      FarmsService.listAll(),
      CropsService.listAll(),
      EquipmentService.list(),
    ]).then(([u, f, c, e]) => {
      setCounts({
        users:     u.status === "fulfilled" ? (u.value.data?.length ?? 0) : 0,
        farms:     f.status === "fulfilled" ? (f.value.data?.length ?? 0) : 0,
        crops:     c.status === "fulfilled" ? (c.value.data?.length ?? 0) : 0,
        equipment: e.status === "fulfilled" ? (e.value.data?.length ?? 0) : 0,
      });
    });
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.dashboard_title")}</h2>
        <p className="page__subtitle">{t("admin.dashboard_subtitle")}</p>
      </div>
      <div className="grid grid--4">
        <StatCard label={t("admin.total_users")}     value={counts.users}     icon={<IconUsers   size={20} />} />
        <StatCard label={t("admin.total_farms")}     value={counts.farms}     icon={<IconFarm    size={20} />} iconVariant="info" />
        <StatCard label={t("admin.total_crops")}     value={counts.crops}     icon={<IconCrop    size={20} />} iconVariant="accent" />
        <StatCard label={t("admin.total_equipment")} value={counts.equipment} icon={<IconRental  size={20} />} />
      </div>
      <div className="admin-dash__notice">
        <p>Use the sidebar to manage farmers, farms, crops, expenses, and equipment listings.</p>
      </div>
    </div>
  );
}
