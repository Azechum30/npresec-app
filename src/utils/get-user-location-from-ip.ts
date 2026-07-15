export const getUserLocationFromIp = async (ipAddress?: string | null) => {
  if (
    !ipAddress ||
    ipAddress === "0000:0000:0000:0000:0000:0000:0000:0000" ||
    ipAddress === "127.0.0.1"
  ) {
    return { country: "Localhost", city: "Development" };
  }

  try {
    const response = await fetch(
      `https://ip-api.com/json/${ipAddress}?fields=status,message,country,regionName,city`,
    );
    const data = await response.json();
    if (data.status === "fail") return null;

    return {
      city: data.city,
      region: data.regionName,
      country: data.country,
    };
  } catch (error) {
    console.error("Geolocation fetch failed:", error);
    return null;
  }
};
