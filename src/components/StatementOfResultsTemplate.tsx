import { StudentGradeRow } from "@/app/(private)/(admin)/admin/grades/_hooks/use-get-students-grades-columns";
import { GRADING_SYSTEM } from "@/lib/constants";
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type Props = {
  data: StudentGradeRow;
  verificationUrl: string;
  verifyUrl: string;
};

const logoPath = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    color: "#1e293b", // Deep slate for better readability
    lineHeight: 1.5,
  },
  // Top accent bar
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#0f172a", // School Primary Color
  },
  headerSection: {
    flexDirection: "column",
    gap: 2,
    marginBottom: 15,
    border: "2pt solid #0d00a4",
    borderBottom: "2px solid #0d00a4",
    borderTop: "2px solid #0d00a4",
    paddingHorizontal: 5,
    paddingVertical: 15,
    textAlign: "center",
    borderRadius: 5,
  },
  institutionName: {
    fontSize: 27,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    color: "#0d00a4",
  },
  documentTitle: {
    fontSize: 12,
    color: "#640d14",
    textTransform: "uppercase",
    marginTop: 4,
    textAlign: "center",
    paddingVertical: 4,
  },

  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 10,
  },

  addressText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: 400,
  },

  addressTextItems: {
    lineHeight: 0.8,
  },
  studentInfoGrid: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#bde0fe",
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 4,
    borderBottom: "1px solid #e2e8f0",
    lineHeight: 2,
  },

  remarksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 10,
    borderBottom: "1pt solid #0f172a",
    lineHeight: 0.8,
  },

  rankRemarks: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#640d14",
  },

  passRemarks: {
    color: "green",
    fontSize: 10,
    fontWeight: "bold",
  },
  failRemarks: {
    color: "red",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoItem: {
    width: "50%",
    // marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: "#475569",
    textTransform: "uppercase",
    fontWeight: "bold",
    lineHeight: 1,
  },
  value: {
    fontSize: 10,
    fontWeight: "medium",
    lineHeight: 1.5,
  },
  // Modern Table (Minimalist)
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #0f172a",
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 5,
    marginBottom: 4,
    backgroundColor: "#bde0fe",
  },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#475569",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottom: "0.5pt solid #f1f5f9",
    lineHeight: 1.1,
  },

  logoContainer: {
    width: 60, // Fixed width for consistency
    height: 60,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Prevents stretching
  },
  columnCode: { width: "15%", lineHeight: 1 },
  columnTitle: { width: "35%", lineHeight: 1 },
  columnCredit: { width: "15%", textAlign: "center", lineHeight: 1 },
  columnGrade: {
    width: "15%",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 1,
  },
  columnGradePoint: {
    width: "20%",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 1,
  },

  // Footer Summary Cards
  summarySection: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    borderTop: "1px solid #e2e8f0",
    lineHeight: 1,
  },
  summaryCard: {
    width: 150,
    padding: 8,
    backgroundColor: "#bde0fe",
    lineHeight: 1,
    fontSize: 16,
  },
  interpretationSection: {
    marginTop: 20,
    padding: 5,
    border: "1pt solid #e2e8f0",
    borderRadius: 4,
  },
  interpretationTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
    color: "#0f172a",
    borderBottom: "0.5pt solid #e2e8f0",
    paddingBottom: 2,
    lineHeight: 2,
    alignContent: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%", // 3 columns
    flexDirection: "row",
    marginBottom: 2,
  },
  gridText: {
    fontSize: 7,
    color: "#475569",
    lineHeight: 2,
  },
  verificationSection: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    rowGap: 10,
    padding: 5,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    flexWrap: "nowrap",
  },
  qrCode: {
    width: 60,
    height: 60,
    flexDirection: "row",
  },
  verifyText: {
    fontSize: 7,
    color: "#64748b",
    maxWidth: 500,
  },
});

export const StatementOfResultsTemplate = ({
  data,
  verificationUrl,
  verifyUrl,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBar} />

      <View style={styles.headerSection}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            columnGap: 2,
          }}>
          <Text style={styles.institutionName}>
            Presbyterian SHTS, Nakpanduri
          </Text>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressText}>
            <Text style={[styles.addressTextItems, { textAlign: "left" }]}>
              Email: registrar@nakpanduripresec.org
            </Text>
            <Text style={[styles.addressTextItems, { textAlign: "left" }]}>
              Website: https://nakpanduripresec.org
            </Text>
            <Text style={[styles.addressTextItems, { textAlign: "left" }]}>
              Phone: (+233)-0244-869-633
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Image src={logoPath} style={styles.logo} />
          </View>
          <View style={[styles.addressText]}>
            <Text style={[styles.addressTextItems, { textAlign: "right" }]}>
              Postal Address: Post Office Box 22
            </Text>
            <Text style={[styles.addressTextItems, { textAlign: "right" }]}>
              Location: Nakpanduri, NE/R, Ghana
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.studentInfoGrid}>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>{data.student.studentNumber}</Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>
            {data.student.firstName} {data.student.lastName}
          </Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>
            {data.student.birthDate.toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Programme</Text>
          <Text style={styles.value}>{data.student.department?.name}</Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Academic Period</Text>
          <Text style={styles.value}>
            {data.metadata.semester} Semester, {data.metadata.academicYear}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text style={styles.documentTitle}>
          ************************* Official Statement of Semester Results
          *************************
        </Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.columnCode]}>Code</Text>
        <Text style={[styles.headerText, styles.columnTitle]}>
          Course Title
        </Text>
        <Text style={[styles.headerText, styles.columnCredit]}>Credits</Text>
        <Text style={[styles.headerText, styles.columnGrade]}>Grade</Text>
        <Text style={[styles.headerText, styles.columnGradePoint]}>
          GradePoint
        </Text>
      </View>

      <View style={{ borderBottom: "1pt solid #0f172a" }}>
        {data.results.map((course) => (
          <View key={course.code} style={styles.tableRow}>
            <Text style={[styles.value, styles.columnCode]}>{course.code}</Text>
            <Text style={[styles.value, styles.columnTitle]}>
              {course.title}
            </Text>
            <Text style={[styles.value, styles.columnCredit]}>
              {course.credits}
            </Text>
            <Text style={[styles.value, styles.columnGrade]}>
              {course.grade}
            </Text>
            <Text style={[styles.value, styles.columnGradePoint]}>
              {(course.points * course.credits).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>TCR: {data.summary.tcr}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>TGP: {data.summary.tgp}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>SGPA: {data.summary.gpa}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>CCR: {data.summary.ccr}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>CGV: {data.summary.cgv}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>CGPA: {data.summary.cgpa}</Text>
        </View>
      </View>
      <View style={styles.remarksContainer}>
        <Text
          style={
            parseFloat(data.summary.gpa) >= 2.0
              ? styles.passRemarks
              : styles.failRemarks
          }>
          Remarks:{" "}
          {parseFloat(data.summary.gpa) >= 2.0
            ? "Good Academic Standing"
            : "Poor Academic Standing"}
        </Text>
        <Text style={styles.rankRemarks}>
          Class Rank: {data.summary.classRank}/{data.summary.totalStudents}
        </Text>
      </View>
      <View style={styles.interpretationSection}>
        <Text style={styles.interpretationTitle}>
          Grade Interpretation Guide
        </Text>
        <View style={styles.gridContainer}>
          {GRADING_SYSTEM.map((item) => (
            <View key={item.grade} style={styles.gridItem}>
              <Text
                style={[styles.gridText, { fontWeight: "bold", width: 35 }]}>
                {item.grade}:
              </Text>
              <Text style={styles.gridText}>
                {item.range} ({item.remark})
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 20, textAlign: "center" }}>
        <Text style={{ fontSize: 8, color: "#94a3b8", fontStyle: "italic" }}>
          This is an electronically generated statement. No signature is
          required.
        </Text>
      </View>
      <View style={styles.verificationSection}>
        <View style={styles.qrCode}>
          <Link src={verifyUrl} href={verifyUrl}>
            <Image src={verificationUrl} />
          </Link>
        </View>
        <View style={{ lineHeight: 1, marginLeft: 10 }}>
          <Text style={[styles.label, { fontSize: 7, lineHeight: 1 }]}>
            Verify Authenticity
          </Text>
          <Text style={[styles.verifyText, { lineHeight: 1 }]}>
            Scan this code to verify the authenticity of this statement on the
            official Presbyterian SHTS portal.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
