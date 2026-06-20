// CONVERTED FROM: src/pages/rentals/CreateRental.jsx
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell  from "../../components/ScreenShell";
import PageHeader   from "../../components/PageHeader";
import RentalForm   from "../../components/rentals/RentalForm";

import { RentalsService } from "../../services/rentalsService";

import { UploadService } from "../../services/uploadService";
import { getErrorMessage }  from "../../utils/errorHandler";
import { validateRequired } from "../../utils/validators";
import { useApp }           from "../../context/AppContext";

export default function CreateRentalScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const { pushToast } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    const required = ["equipment_name", "village", "taluka", "district", "state", "owner_name", "phone"];
    if (!validateRequired(formData, required)) {
      pushToast(t("rentalCreate.fillRequiredFields"), "error"); return;
    }
    if (!formData.price_per_hour && !formData.price_per_day) {
      pushToast(t("rentalCreate.addPrice"), "error"); return;
    }
    if (!formData?.equipment_images?.length) {
      pushToast(t("rentalCreate.uploadImage"), "error"); return;
    }
    try {
      setLoading(true);
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
        owner_name:   formData.owner_name?.trim(),
        phone:        formData.phone?.trim(),
        description:  formData.description?.trim(),
        equipment_images: formData.equipment_images,
      };

      const uploadData =
        await UploadService.getUploadUrls(
          "rentals",
          formData.equipment_images
        );

      console.log(uploadData);
      const imageUrls =
        await UploadService.uploadFilesToS3(
          formData.equipment_images,
          uploadData.uploads
        );

      payload.equipment_images =
        imageUrls;

      await RentalsService.createRental(
        payload
      );
            
      pushToast(t("rentalCreate.createdSuccess"), "success");
      navigation.navigate("MyRentals");
    } catch (error) {
      pushToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title={t("rentalCreate.createRental")} showBack>
      <PageHeader title={t("rentalCreate.createRental")} subtitle={t("rentalCreate.addEquipment")} />
      <RentalForm mode="create" loading={loading} onSubmit={handleSubmit} />
    </ScreenShell>
  );
}