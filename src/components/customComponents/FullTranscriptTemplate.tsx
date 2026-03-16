import { GRADING_SYSTEM } from "@/lib/constants";
import { env } from "@/lib/server-only-actions/validate-env";
import { StudentResponseType } from "@/lib/types";
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const logoPath = `${env.NEXT_PUBLIC_URL}/logo.png`;

type TranscriptData = {
  student: StudentResponseType;
  semesters: {
    academicYear: number;
    semester: string;
    results: any[];
    tgp: string;
    tcr: number;
    gpa: string;
    cgv: string;
    ccr: number;
    cgpa: string;
  }[];
  metadata: {
    dateGenerated: string;
    totalSemesters: number;
    finalCgpa: string;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    marginBottom: 60,
  },
  header: { marginBottom: 20, textAlign: "center" },
  studentInfo: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  semesterSection: { marginBottom: 10 },
  semesterTitle: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#fff0f3",
    padding: 4,
    marginBottom: 5,
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
    marginBottom: 10,
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
  infoItem: {
    // width: "20%",
  },
  label: {
    fontSize: 8,
    color: "#475569",
    textTransform: "uppercase",
    fontWeight: "bold",
    lineHeight: 1.5,
  },
  value: {
    fontSize: 10,
    fontWeight: "medium",
    lineHeight: 1,
  },

  studentInfoGrid: {
    flexDirection: "row",
    marginBottom: 10,
    // backgroundColor: "#bde0fe",
    paddingHorizontal: 5,
    paddingVertical: 8,
    // borderRadius: 4,
    borderBottom: "1px solid #000",
    lineHeight: 1.5,
    justifyContent: "space-between",
  },

  // Table Styles
  table: {
    display: "flex",
    width: "auto",
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "20%",
    borderBottom: "1pt solid #0f172a",
    borderTop: "1pt solid #0f172a",
    backgroundColor: "#edf2fb",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  tableCol: {
    width: "20%",
    borderBottom: "0.5pt solid #f1f5f9",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  courseTitleCol: { width: "40%" }, // Wider column for course titles

  // Summary Styles
  summaryBox: {
    marginTop: 5,
    padding: 2,
    // border: "1pt solid #0f172a",
    // borderBottom: "1pt solid #0f172a",
    borderTop: "1pt solid #0f172a",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#edf2fb",
  },
  summaryText: { fontWeight: "bold", fontSize: 8 },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTop: "1px solid #ccc",
    paddingTop: 5,
    fontSize: 10,
    color: "grey",
  },
});

export const FullTranscriptTemplate = ({
  data,
  verificationUrl,
  verifyUrl,
}: {
  data: TranscriptData;
  verificationUrl: string;
  verifyUrl: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 1. Header */}
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

      {/* 2. Student Details */}
      <View style={styles.studentInfoGrid}>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>
            {data.student.middleName
              ? `${data.student.lastName} ${data.student.firstName} ${data.student.middleName}`
              : `${data.student.firstName} ${data.student.lastName}`}
          </Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>
            {new Intl.DateTimeFormat("en-GH", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(data.student.birthDate)}
          </Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Gender/Sex:</Text>
          <Text style={styles.value}>{data.student.gender}</Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Programme:</Text>
          <Text style={styles.value}>{data.student.department?.name}</Text>
        </View>
        <View style={[styles.infoItem, { lineHeight: 1 }]}>
          <Text style={styles.label}>Academic Period:</Text>
          <Text style={[{ lineHeight: 1 }]}>
            {new Intl.DateTimeFormat("en-GH", {
              month: "short",
              year: "numeric",
            }).format(data.student.dateEnrolled)}{" "}
            -{" "}
            {new Intl.DateTimeFormat("en-GH", {
              month: "short",
              year: "numeric",
            }).format(data.student.graduationDate as Date)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text style={styles.documentTitle}>
          *********************** Official Transcript of Academic Records
          ***********************
        </Text>
      </View>

      {/* 3. Loop through Semesters */}
      {data.semesters.map((sem, index) => (
        <View key={index} style={[styles.semesterSection]}>
          <Text style={styles.semesterTitle}>
            {sem.academicYear}/{sem.academicYear + 1} Academic Year -{" "}
            {sem.semester} Semester
          </Text>

          {/* Results Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text>Code</Text>
              </View>
              <View style={[styles.tableColHeader, styles.courseTitleCol]}>
                <Text>Course Title</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={{ textAlign: "center" }}>Credits</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={{ textAlign: "center" }}>Grade</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={{ textAlign: "center" }}>Points</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={{ textAlign: "center" }}>Grade Points</Text>
              </View>
            </View>

            {sem.results.map((res: any, rIdx: number) => (
              <View
                style={[
                  styles.tableRow,
                  { backgroundColor: (rIdx + 1) % 2 === 0 ? "#bde0fe" : "" },
                ]}
                key={rIdx}>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text>{res.code}</Text>
                </View>
                <View style={[styles.tableCol, styles.courseTitleCol]}>
                  <Text>{res.title}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ textAlign: "center" }}>{res.credits}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ textAlign: "center" }}>{res.grade}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ textAlign: "center" }}>
                    {res.points.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ textAlign: "center" }}>
                    {(res.credits * res.points).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Semester Summary Table Footer */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>TCR: {sem.tcr}</Text>
            <Text style={styles.summaryText}>TGP: {sem.tgp}</Text>
            <Text style={styles.summaryText}>SGPA: {sem.gpa}</Text>
            <Text style={[styles.summaryText, { color: "#c1121f" }]}>
              CCR: {sem.ccr}
            </Text>
            <Text style={[styles.summaryText, { color: "#c1121f" }]}>
              CGV: {sem.cgv}
            </Text>
            <Text style={[styles.summaryText, { color: "#c1121f" }]}>
              CGPA: {sem.cgpa}
            </Text>
          </View>
        </View>
      ))}

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#e9f5db",
          justifyContent: "space-between",
          borderTop: "1px solid #0f172a",
        }}>
        <View
          style={{
            padding: 4,
          }}>
          <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
            Final GPA:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {parseFloat(data.metadata.finalCgpa).toFixed(2)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            padding: 4,
          }}>
          <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
            Total Semesters:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {data.metadata.totalSemesters}
            </Text>
          </Text>
        </View>
        <View
          style={{
            padding: 4,
          }}>
          <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
            Class Designation:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {parseFloat(data.metadata.finalCgpa) >= 3.5
                ? "First Class Honours"
                : parseFloat(data.metadata.finalCgpa) >= 3.0
                  ? "Second Class Honours"
                  : parseFloat(data.metadata.finalCgpa) >= 2.5
                    ? "Second Class Lower"
                    : parseFloat(data.metadata.finalCgpa) >= 2.0
                      ? "Third Class"
                      : parseFloat(data.metadata.finalCgpa) >= 1.5
                        ? "Pass"
                        : "Fail"}
            </Text>
          </Text>
        </View>
      </View>

      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 60,
            marginBottom: 20,
          },
        ]}>
        <View
          style={[
            {
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            },
          ]}>
          <View
            style={{
              width: 60,
              height: 60,
              border: "2pt solid #0d00a4",
              borderRadius: 3,
            }}>
            <Link src={verifyUrl} href={verifyUrl}>
              <Image style={{ width: "100%" }} src={verificationUrl} />
            </Link>
          </View>
          <View>
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 8,
                fontWeight: "bold",
                color: "#495057",
              }}>
              Verify Authenticity
            </Text>
            <Text style={[{ lineHeight: 1, fontSize: 8, color: "#495057" }]}>
              Scan this code to verify this transcript.
            </Text>
            <Text style={{ fontSize: 8, color: "#495057" }}>
              Transcript Generated on {data.metadata.dateGenerated}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 5, alignItems: "center" }}>
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#495057",
            }}></View>
          <Text style={{ fontSize: 10, fontWeight: "bold", lineHeight: 1 }}>
            Mohammed Michael Issah
          </Text>
          <Text style={{ fontSize: 8, lineHeight: 1, textAlign: "center" }}>
            (Headmaster)
          </Text>
        </View>
      </View>

      <View break={true}>
        <Text
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 12,
            marginBottom: 5,
          }}>
          Grade Interpretation Guide
        </Text>
        <View style={{ border: "1pt solid #000" }}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#000",
              borderLeft: 0,
              borderRight: 0,
              borderTop: 0,
              textAlign: "center",
              fontSize: 10,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}>
            <Text
              style={{
                width: "50%",
                padding: 5,
              }}>
              Grade
            </Text>
            <Text
              style={{
                width: "50%",
                borderLeft: "1pt solid #000",
                padding: 5,
              }}>
              Score Range
            </Text>
            <Text
              style={{
                width: "50%",
                borderLeft: "1pt solid #000",
                padding: 5,
              }}>
              Remarks
            </Text>
          </View>

          {GRADING_SYSTEM.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#000",
                borderLeft: 0,
                borderRight: 0,
                borderBottom: 0,
                borderTop: index === 0 ? 0 : 1,
                backgroundColor: (index + 1) % 2 === 0 ? "#bde0fe" : "",
                textAlign: "center",
                fontSize: 10,
              }}
              key={item.grade}>
              <Text
                style={{
                  width: "50%",
                  padding: 5,
                }}>
                {item.grade}
              </Text>
              <Text
                style={{
                  width: "50%",
                  borderLeft: "1pt solid #000",
                  padding: 5,
                }}>
                {item.range}
              </Text>
              <Text
                style={{
                  width: "50%",
                  borderLeft: "1pt solid #000",
                  padding: 5,
                }}>
                {item.remark}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer} fixed>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber}/${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);
