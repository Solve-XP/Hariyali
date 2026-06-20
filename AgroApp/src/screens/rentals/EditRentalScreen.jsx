// CONVERTED FROM: src/pages/rentals/EditRental.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell  from "../../components/ScreenShell";
import PageHeader   from "../../components/PageHeader";
import RentalForm   from "../../components/rentals/RentalForm";

import { RentalsService }   from "../../services/rentalsService";
import { getErrorMessage }  from "../../utils/errorHandler";
import { validateRequired } from "../../utils/validators";
import { useApp }           from "../../context/AppContext";
import { colors }           from "../../theme";

export default function EditRentalScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const route         = useRoute();
  const { pushToast } = useApp();
  const { id }        = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [rental,  setRental]  = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await RentalsService.getRentalById(id);
        setRental(res?.data);
      } catch (error) {
        pushToast(getErrorMessage(error), "error");
        navigation.navigate("MyRentals");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (formData) => {
    const required = ["equipment_name", "village", "taluka", "district", "state", "owner_name", "phone"];
    if (!validateRequired(formData, required)) {
      pushToast(t("rentalCreate.fillRequiredFields"), "error"); return;
    }
    if (!formData.price_per_hour && !formData.price_per_day) {
      pushToast(t("rentalCreate.addPrice"), "error"); return;
    }
    try {
      setSaving(true);
      const payload = {
        equipment_name: formData.equipment_name?.trim(),
        price_per_hour: formData.price_per_hour ? Number(formData.price_per_hour) : undefined,
        price_per_day:  formData.price_per_day  ? Number(formData.price_per_day)  : undefined,
        village:   formData.village?.trim(),
        taluka:    formData.taluka?.trim(),
        district:  formData.district?.trim(),
        state:     formData.state?.trim(),
        latitude:  formData.latitude,
        longitude: formData.longitude,
        owner_name:  formData.owner_name?.trim(),
        phone:       formData.phone?.trim(),
        description: formData.description?.trim(),
      };
      await RentalsService.updateRental(id, payload);
      pushToast(t("editRental.updatedSuccess"), "success");
      navigation.navigate("MyRentals");
    } catch (error) {
      pushToast(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenShell title={t("editRental.editRental")} showBack>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={t("editRental.editRental")} showBack>
      <PageHeader title={t("editRental.editRental")} subtitle={t("editRental.updateRentalDetails")} />
      <RentalForm mode="edit" loading={saving} initialValues={rental} onSubmit={handleSubmit} />
    </ScreenShell>
  );
}