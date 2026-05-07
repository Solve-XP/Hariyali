import "./AdminEquipment.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import { EquipmentService } from "../../services/api";
import Table from "../../components/Table";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import { IconTrash, IconRental } from "../../components/Icons";

export default function AdminEquipment() {
  const { t } = useTranslation();
  const { pushToast } = useApp();
  const [list, setList] = useState([]);

  const load = () => EquipmentService.list().then((r) => setList(r.data ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.delete_confirm"))) return;
    try {
      await EquipmentService.remove(id);
      pushToast(t("messages.EQUIPMENT_DELETED_SUCCESS"));
      load();
    } catch { pushToast(t("messages.GENERIC_ERROR"), "error"); }
  };

  const columns = [
    { key: "name",  header: t("rental.name"),    render: (r) => <strong>{r.name}</strong> },
    { key: "owner", header: t("admin.owner"),    render: (r) => r.owner_name },
    { key: "price", header: t("rental.price"),   render: (r) => `₹${r.price_per_day}/day` },
    { key: "loc",   header: t("rental.location"), render: (r) => r.location },
    { key: "phone", header: t("rental.contact"), render: (r) => r.phone },
    { key: "del",   header: t("common.actions"), width: "80px",
      render: (r) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(r.id)} title={t("common.delete")}>
          <IconTrash />
        </Button>
      )
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("admin.equipment_title")}</h2>
        <p className="page__subtitle">{t("admin.equipment_subtitle")}</p>
      </div>
      <div className="page__section">
        {list.length === 0 ? (
          <EmptyState icon={<IconRental />} message={t("rental.empty")} />
        ) : (
          <Table columns={columns} rows={list} rowKey={(r) => r.id} emptyMessage={t("rental.empty")} />
        )}
      </div>
    </div>
  );
}
