import QRCode from "qrcode";

export const generateGenericQRCode = async (url: string) => {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: "#0d00a4", light: "#ffffff" },
    });

    return dataUrl;
  } catch (e) {
    console.error(e);
    return "";
  }
};
