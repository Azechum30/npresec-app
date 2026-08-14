/** biome-ignore-all assist/source/organizeImports: reason */

import { toProperCase } from "@/lib/to-proper-case";
import type { exeatServerResponseType } from "@/lib/validation";
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Modern typography & slate palette design suited for A5 layout
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#0d00a4", // Professional Institution Blue
  },

  // Header section refactored into a clean, modern grid setup
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 8,
    marginBottom: 5,
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 80,
    height: 80,
    border: "1px solid #e2e8f0",
    borderRadius: 2,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  titleArea: {
    flexDirection: "column",
  },
  institutionName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  metaText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
    marginTop: -4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0d00a4",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 1,
  },

  // Main structural grid for Student details vs QR Code side-by-side
  mainGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
    lineHeight: 1,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    lineHeight: 0.9,
  },
  sidebarColumn: {
    width: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  qrCodeWrapper: {
    width: 90,
    height: 90,
    padding: 6,
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
  qrCode: {
    width: "100%",
    height: "100%",
  },
  qrLabel: {
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
    textTransform: "uppercase",
  },

  // Modern card-style metadata blocks
  sectionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 12,
    border: "1px solid #f1f5f9",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
    lineHeight: 0.8,
  },
  infoGrid: {
    flexDirection: "row",
    rowGap: 4,
  },
  infoBlock: {
    width: "50%",
    flexDirection: "column",
  },
  fullWidthBlock: {
    width: "100%",
    flexDirection: "column",
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // Dual signatures grid layout at the base
  footerSignatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Pushes signatures directly to page bottom safely
    paddingTop: 16,
    borderTop: "1px solid #e2e8f0",
  },
  sigLine: {
    width: "40%",
    flexDirection: "column",
    alignItems: "center",
  },
  linePlaceholder: {
    width: "100%",
    borderBottom: "1px dashed #cbd5e1",
    marginBottom: 4,
    height: 25, // Clear vertical breathing room for signing physical slips
  },
  sigLabel: {
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
});

export const ExeatCheatTemplate = ({
  data,
  QRcodeUrl,
  verificationURL,
}: {
  data: exeatServerResponseType;
  QRcodeUrl: string;
  verificationURL: string;
}) => {
  const logoPath = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`;

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.accentBar} />

        {/* Clean, Modern Header Bar Area */}
        <View style={styles.headerContainer}>
          <View style={styles.brandWrapper}>
            <View style={styles.logoContainer}>
              <Image src={logoPath} style={styles.logo} />
            </View>
            <View style={styles.titleArea}>
              <Text style={styles.institutionName}>
                Presbyterian SHTS, Nakpanduri
              </Text>
              <Text style={styles.metaText}>
                Box 22, Nakpanduri, NE/R, Ghana • registrar@nakpanduripresec.org
              </Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Official Exeat Slip</Text>
          </View>
        </View>

        {/* Main Content Layout Block split into Details and Sidebar Verification */}
        <View style={styles.mainGrid}>
          {/* Main Structural Information Columns */}
          <View style={styles.detailsColumn}>
            {/* Card Block 1: Core Student Profile Information */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Student Details</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>
                    {`${data.student.lastName || ""} ${data.student.firstName || ""} ${data.student.middleName || ""}`.trim() ||
                      "N/A"}
                  </Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Class/Form</Text>
                  <Text style={styles.value}>
                    {`${data.currentClass.name}, ${toProperCase(data.level)}` ||
                      "N/A"}
                  </Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Assigned House</Text>
                  <Text style={styles.value}>{data.house.name}</Text>
                </View>
              </View>
            </View>

            {/* Card Block 2: Exeat Logistical Validation Parameters */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Exeat Details</Text>
              <View style={[styles.infoGrid]}>
                <View style={[styles.infoBlock]}>
                  <Text style={styles.label}>Type</Text>
                  <Text style={styles.value}>{toProperCase(data.type)}</Text>
                </View>
                <View style={[styles.infoBlock]}>
                  <Text style={styles.label}>Destination</Text>
                  <Text style={styles.value}>{data.destination}</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Departure Date</Text>
                  <Text style={styles.value}>
                    {new Intl.DateTimeFormat("en-GH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(data.departureDate as Date)}
                  </Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>Expected Return</Text>
                  <Text style={styles.value}>
                    {new Intl.DateTimeFormat("en-GH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(data.expectedReturnDate as Date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Sidebar containing verification mechanics */}
          <View style={styles.sidebarColumn}>
            <View style={styles.qrCodeWrapper}>
              {QRcodeUrl ? (
                <Link href={verificationURL}>
                  <Image src={QRcodeUrl} style={styles.qrCode} />
                </Link>
              ) : (
                <View style={[styles.qrCode, { backgroundColor: "#e2e8f0" }]} />
              )}
            </View>
            <Text style={styles.qrLabel}>Scan to Verify Status</Text>
          </View>
        </View>

        {/* Double Signature Row layout anchoring the document validity */}
        <View style={styles.footerSignatures}>
          <View style={styles.sigLine}>
            <View style={styles.linePlaceholder} />
            <Text style={styles.sigLabel}>Housemaster / Mistress</Text>
          </View>
          <View style={styles.sigLine}>
            <View style={styles.linePlaceholder} />
            <Text style={styles.sigLabel}>Senior Housemaster</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
