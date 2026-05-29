def mask_name(name: str):

    if not name:
        return ""

    parts = name.split()

    masked_parts = []

    for part in parts:

        if len(part) <= 2:

            masked_parts.append(
                part[0] + "x"
            )

        else:

            masked = (
                part[0]
                + "x" * (len(part) - 2)
                + part[-1]
            )

            masked_parts.append(masked)

    return " ".join(masked_parts)

def mask_phone(phone: str):

    if not phone or len(phone) < 10:
        return phone

    return (
        phone[:2]
        + "******"
        + phone[-2:]
    )