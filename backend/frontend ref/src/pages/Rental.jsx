import "./Rental.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { EquipmentService } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";
import { IconPlus, IconPhone, IconMessage, IconLocation, IconRental } from "../components/Icons";
import EmptyState from "../components/EmptyState";

const EMPTY = { name: "", price_per_day: "", location: "", owner_name: "", phone: "" };

export default function Rental() {
  const { t } = useTranslation();
  const { pushToast } = useApp();
  const [list, setList]   = useState([]);
  const [form, setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => EquipmentService.list().then((r) => setList(r.data ?? [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price_per_day, location, owner_name, phone } = form;
    if (!name || !price_per_day || !location || !owner_name || !phone) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    setLoading(true);
    try {
      await EquipmentService.create({ ...form, price_per_day: parseFloat(form.price_per_day) });
      pushToast(t("messages.EQUIPMENT_ADDED_SUCCESS"));
      setForm(EMPTY);
      load();
    } catch { pushToast(t("messages.GENERIC_ERROR"), "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{t("rental.title")}</h2>
        <p className="page__subtitle">{t("rental.subtitle")}</p>
      </div>

      <Card>
        <h3 className="section__title" style={{ marginBottom: "var(--space-4)" }}>{t("rental.add_title")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input label={t("rental.name")}       placeholder={t("rental.name_placeholder")}     value={form.name}         onChange={set("name")} />
            <Input label={t("rental.price")}      placeholder={t("rental.price_placeholder")}    value={form.price_per_day} onChange={set("price_per_day")} type="number" min="0" />
            <Input label={t("rental.location")}   placeholder={t("rental.location_placeholder")} value={form.location}     onChange={set("location")} />
            <Input label={t("rental.owner")}      placeholder={t("rental.owner_placeholder")}    value={form.owner_name}   onChange={set("owner_name")} />
            <Input label={t("rental.contact")}    placeholder={t("rental.phone_placeholder")}    value={form.phone}        onChange={set("phone")} type="tel" />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}><IconPlus /> {t("common.add")}</Button>
          </div>
        </form>
      </Card>

      <div className="page__section">
        <div className="section__header">
          <h3 className="section__title">{t("rental.list_title")}</h3>
          <Badge variant="neutral">{list.length} {t("rental.name")}</Badge>
        </div>
        {list.length === 0 ? (
          <EmptyState icon={<IconRental />} message={t("rental.empty")} />
        ) : (
          <div className="equipment-grid">
            {list.map((item) => (
              <div key={item.id} className="equipment-card">
                <div className="equipment-card__head">
                  <span className="equipment-card__name">{item.name}</span>
                  <span className="equipment-card__price">
                    {t("common.currency")}{item.price_per_day.toLocaleString()}
                    <small> {t("rental.price_per_day")}</small>
                  </span>
                </div>
                <div className="equipment-card__meta">
                  <div className="equipment-card__row"><IconLocation size={13} /> {item.location}</div>
                  <div className="equipment-card__row"><IconPhone    size={13} /> {item.owner_name}</div>
                  <div className="equipment-card__row"><IconPhone    size={13} /> {item.phone}</div>
                </div>
                <div className="equipment-card__actions">
                  <a href={`tel:${item.phone}`} style={{ flex: 1 }}>
                    <Button variant="primary" block size="sm"><IconPhone /> {t("rental.call")}</Button>
                  </a>
                  <a href={`https://wa.me/${item.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                    <Button variant="secondary" block size="sm"><IconMessage /> {t("rental.message")}</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
