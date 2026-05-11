import "./AdminUsers.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UsersService } from "../../services/api";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import EmptyState from "../../components/EmptyState";
import { IconUsers } from "../../components/Icons";

export default function AdminUsers() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);

  useEffect(() => {
    UsersService.list().then((r) => setList(r.data ?? [])).catch(() => {});
  }, []);

  const columns = [
    { key: "name",   header: t("common.name"),   render: (r) => <strong>{r.name}</strong> },
    { key: "phone",  header: t("common.phone"),  render: (r) => r.phone },
    { key: "status", header: t("common.status"), render: (r) =>
        <Badge variant={r.status === "active" ? "success" : "neutral"}>{r.status}</Badge> },
    { key: "joined", header: t("admin.joined"),  render: (r) => r.joined_at || "—" },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.users_title")}</h2>
        <p className="page__subtitle">{t("admin.users_subtitle")}</p>
      </div>
      <div className="page__section">
        {list.length === 0 ? (
          <EmptyState icon={<IconUsers />} message={t("common.no_data")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("common.no_data")} />
        )}
      </div>
    </div>
  );
}
