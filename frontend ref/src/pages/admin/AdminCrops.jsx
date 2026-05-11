import "./AdminCrops.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CropsService } from "../../services/api";
import Table from "../../components/Table";
import EmptyState from "../../components/EmptyState";
import { IconCrop } from "../../components/Icons";

export default function AdminCrops() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);

  useEffect(() => {
    CropsService.listAll().then((r) => setList(r.data ?? [])).catch(() => {});
  }, []);

  const columns = [
    { key: "name",    header: t("crops.name"),             render: (r) => <strong>{r.name}</strong> },
    { key: "farm",    header: t("crops.farm"),             render: (r) => r.farm_id },
    { key: "season",  header: t("crops.season"),           render: (r) => r.season || "—" },
    { key: "sowing",  header: t("crops.sowing_date"),      render: (r) => r.sowing_date || "—" },
    { key: "harvest", header: t("crops.expected_harvest"), render: (r) => r.expected_harvest || "—" },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.crops_title")}</h2>
        <p className="page__subtitle">{t("admin.crops_subtitle")}</p>
      </div>
      <div className="page__section">
        {list.length === 0 ? (
          <EmptyState icon={<IconCrop />} message={t("common.no_data")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("common.no_data")} />
        )}
      </div>
    </div>
  );
}
