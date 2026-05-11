import "./AdminFarms.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FarmsService } from "../../services/api";
import Table from "../../components/Table";
import EmptyState from "../../components/EmptyState";
import { IconFarm } from "../../components/Icons";

export default function AdminFarms() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);

  useEffect(() => {
    FarmsService.listAll().then((r) => setList(r.data ?? [])).catch(() => {});
  }, []);

  const columns = [
    { key: "name",      header: t("farms.name"),      render: (r) => <strong>{r.name}</strong> },
    { key: "acres",     header: t("farms.acres"),     render: (r) => r.acres },
    { key: "location",  header: t("farms.location"),  render: (r) => r.location },
    { key: "soil_type", header: t("farms.soil_type"), render: (r) => r.soil_type || "—" },
    { key: "user",      header: t("admin.owner"),     render: (r) => r.user_id },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.farms_title")}</h2>
        <p className="page__subtitle">{t("admin.farms_subtitle")}</p>
      </div>
      <div className="page__section">
        {list.length === 0 ? (
          <EmptyState icon={<IconFarm />} message={t("common.no_data")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("common.no_data")} />
        )}
      </div>
    </div>
  );
}
