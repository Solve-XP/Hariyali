const GEOAPIFY_KEY =
  import.meta.env.VITE_GEOAPIFY_KEY;

export async function reverseGeocode(
  latitude,
  longitude
) {

  const response =
    await fetch(

`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`

    );

  const data =
    await response.json();

  const location =
    data?.features?.[0]
      ?.properties;

  return {

    village:
        location?.village ||
        location?.suburb ||
        location?.hamlet ||
        location?.town ||
        location?.city ||
        location?.municipality ||
        location?.county ||
        "",

    taluka:
      location?.county ||
      "",

    district:
      location?.state_district ||
      "",

    state:
      location?.state ||
      "",

    pincode:
      location?.postcode ||
      "",
  };
}