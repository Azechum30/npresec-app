import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ReactNode } from "react";

type EnrollmentTemplateProps = {
  data: {
    id: string;
    createdAt: Date;
    lastName: string;
    otherNames: string;
    birthDate: Date;
    jhsIndexNumber: string;
    gender: string;
    programme: string;
    residentialStatus: string;
    hometown: string | null;
    jhsAttended: string;
    schoolLocation: string | null;
    district: string | null;
    schoolRegion: string | null;
    enrollmentCode: string | null;
    guardianName: string | null;
    guardianRelation: string | null;
    guardianPhoneNumber: string | null;
    primaryAddress: string | null;
    aggregateScore: number | null;
    phone?: string;
    email?: string;
    guadianEmail?: string;
    isAcceptancePaid: boolean;
    isFormSubmitted: boolean;
    updatedAt: Date;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    color: "#1e293b",
    position: "relative",
  },

  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#0f172a",
  },
  pageHeader: {
    flexDirection: "column",
    borderBottom: "1px solid #1A1110",
    borderTop: "4px solid #1A1110",
    alignItems: "center",
    columnGap: 2,
    padding: 5,
    backgroundColor: "#0000FF1A",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: "22px",
    lineHeight: 1.2,
    fontFamily: "Helvetica-Bold",
  },
  pageDescription: {
    fontSize: "10px",
    color: "#282A2C",
  },
  fieldset: {
    borderWidth: 1,
    borderColor: "#1A1110",
    padding: 20,
    marginTop: 10,
    position: "relative",
    borderRadius: 5,
  },
  legend: {
    position: "absolute",
    top: -7,
    left: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },

  legendMark: {
    width: 5,
    height: 5,
    backgroundColor: "#1A111080",
    borderRadius: 50,
  },

  legendText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },

  fieldsetGroup: { flexDirection: "column", gap: 10 },
  fieldGroupContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  fieldsetSubGroup: { flexDirection: "column", gap: 3, flex: 1 },
  fieldLabel: { fontSize: 10, fontWeight: 600 },
  fieldInput: {
    fontSize: 10,
    border: "1px solid #6c757d",
    paddingVertical: 5,
    borderRadius: 2,
    paddingHorizontal: 10,
    lineHeight: 0.8,
  },
});

export const EnrollmentTemplate = ({ data }: EnrollmentTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Enrollment Summary</Text>
          <Text style={styles.pageDescription}>
            NOTE: Kindly present a copy to the school
          </Text>
        </View>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <MyFieldSet title="Student's Bio Data">
            <View style={styles.fieldsetGroup}>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Surname:</Text>
                  <Text style={styles.fieldInput}>{data.lastName}</Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Other Names:</Text>
                  <Text style={styles.fieldInput}>{data.otherNames}</Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Date of Birth:</Text>
                  <Text style={styles.fieldInput}>
                    {new Intl.DateTimeFormat("en-GH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(data.birthDate)}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Gender:</Text>
                  <Text style={styles.fieldInput}>
                    {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Hometown:</Text>
                  <Text style={styles.fieldInput}>
                    {data.hometown ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Primary Address:</Text>
                  <Text style={styles.fieldInput}>{data.primaryAddress}</Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Contact:</Text>
                  <Text style={styles.fieldInput}>{data.phone ?? "N/A"}</Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Email:</Text>
                  <Text style={styles.fieldInput}>{data.email ?? "N/A"}</Text>
                </View>
              </View>
            </View>
          </MyFieldSet>
          <MyFieldSet title="Academic History">
            <View style={styles.fieldsetGroup}>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Enrollment Code:</Text>
                  <Text style={styles.fieldInput}>
                    {data.enrollmentCode ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>JHS Index Number:</Text>
                  <Text style={styles.fieldInput}>{data.jhsIndexNumber}</Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>JHS Attended:</Text>
                  <Text style={styles.fieldInput}>{data.jhsAttended}</Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Location:</Text>
                  <Text style={styles.fieldInput}>
                    {data.schoolLocation ?? "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>District:</Text>
                  <Text style={styles.fieldInput}>
                    {data.district ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Region:</Text>
                  <Text style={styles.fieldInput}>
                    {data.schoolRegion ?? "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </MyFieldSet>
          <MyFieldSet title="Parent/Guardian Data">
            <View style={styles.fieldsetGroup}>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Fullname:</Text>
                  <Text style={styles.fieldInput}>
                    {data.guardianName ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Guardian Contact:</Text>
                  <Text style={styles.fieldInput}>
                    {data.guardianPhoneNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Guardian Email:</Text>
                  <Text style={styles.fieldInput}>
                    {data.guadianEmail ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Relation with Student:</Text>
                  <Text style={styles.fieldInput}>
                    {data.guardianRelation ?? "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </MyFieldSet>
          <MyFieldSet title="Programme/Residential Status">
            <View style={styles.fieldsetGroup}>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Programme:</Text>
                  <Text style={styles.fieldInput}>
                    {data.programme ?? "N/A"}
                  </Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Residential Status:</Text>
                  <Text style={styles.fieldInput}>
                    {data.residentialStatus}
                  </Text>
                </View>
              </View>
              <View style={styles.fieldGroupContainer}>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Aggregate Score:</Text>
                  <Text style={styles.fieldInput}>{data.aggregateScore}</Text>
                </View>
                <View style={styles.fieldsetSubGroup}>
                  <Text style={styles.fieldLabel}>Enrollment Date:</Text>
                  <Text style={styles.fieldInput}>
                    {new Intl.DateTimeFormat("en-GH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(data.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </MyFieldSet>
        </View>
      </Page>
    </Document>
  );
};

const MyFieldSet = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.fieldset}>
    <View style={styles.legend}>
      <View style={styles.legendMark} />
      <Text style={styles.legendText}>{title}</Text>
    </View>
    {children}
  </View>
);
