/**biome-ignore-all assist/source/organizeImports:reason */

import type { TemplateServerResponseType } from "@/lib/types";
import {
  Font,
  Image,
  Line,
  Link,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import html_parser from "html-dom-parser";
import path from "node:path";

interface AdmissionLetterTemplateProps {
  studentName: string;
  admissionReference: string;
  houseAllocated: string;
  residentialStatus: string;
  programme: string;
  selectedClass: string;
  qrcodeUrl: string;
  verificationLink: string;
  templateData: TemplateServerResponseType;
}

const fontsDirectory = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: path.join(fontsDirectory, "Poppins-Regular.ttf"),
      fontWeight: "normal",
    },
    {
      src: path.join(fontsDirectory, "Poppins-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 38,
    fontFamily: "Poppins",
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
  letterhead: {
    borderTop: "3px solid #4361ee",
    borderBottom: "3px solid #4361ee",
    padding: 2,
    backgroundColor: "#f8f9fa",
  },
  schoolNameGroup: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  school: {
    fontSize: 29,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#4361ee",
  },
  slug: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#c1121f",
    textAlign: "center",
    letterSpacing: 1.5,
    marginTop: -10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    marginHorizontal: "auto",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  letterheadGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  letterheadGridText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: 400,
    lineHeight: 1.5,
    width: "100%",
  },
  admissionRef: {
    flexDirection: "row",
    border: "1px solid #e2e8f0",
    lineHeight: 1.0,
    fontSize: 10,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 5,
  },
  admissionRefTextTitle: {
    textTransform: "uppercase",
    fontWeight: 800,
    fontSize: 8,
  },
  admissionRefGroup: {
    borderLeft: "1px solid #e2e8f0",
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: "50%",
  },
  salutation: {
    marginTop: 10,
    marginBottom: 5,
  },
  admissionDetails: {
    flexDirection: "row",
    gap: 5,
  },
  admissionDetailsTitle: {
    color: "#64748b",
    textTransform: "uppercase",
    fontSize: 10,
    lineHeight: 2,
  },
  admissionDetailsValue: {
    fontWeight: 800,
    textTransform: "uppercase",
    fontSize: 10,
  },
  signatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: 180,
    flexDirection: "column",
    alignItems: "center",
  },
  svgWrapper: {
    width: 180,
    height: 10,
    marginBottom: 6,
    marginTop: -25,
  },
  titleText: {
    fontFamily: "Poppins",
    fontSize: 10,
    fontWeight: "bold",
    color: "#1A202C",
  },
  subText: {
    fontFamily: "Poppins",
    fontSize: 8,
    color: "#718096",
  },
  htmlParagraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 2,
    textAlign: "justify",
  },
  htmlListBlock: {
    marginTop: 2,
  },
  htmlListItemRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 2,
  },
  htmlListItemContent: {
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

const RenderHtmlString = ({ htmlContent }: { htmlContent: string }) => {
  const parseInlineStyles = (styleStr?: string) => {
    const inherited: any[] = [];
    if (!styleStr) return inherited;
    if (styleStr.includes("text-align: left"))
      inherited.push({ textAlign: "left" });
    if (styleStr.includes("text-align: right"))
      inherited.push({ textAlign: "right" });
    if (styleStr.includes("text-align: center"))
      inherited.push({ textAlign: "center" });
    if (styleStr.includes("text-align: justify"))
      inherited.push({ textAlign: "justify" });
    return inherited;
  };

  // Safe recursive inline processing engine supporting nested bold, italic, and spans
  const processInlineContent = (
    nodes: any[],
    currentStyles: any[] = [],
  ): any => {
    if (!nodes) return "";
    return nodes.map((node, idx) => {
      if (node.type === "text") {
        return currentStyles.length > 0 ? (
          <Text key={`text-span-${idx.toString()}`} style={currentStyles}>
            {node.data}
          </Text>
        ) : (
          node.data
        );
      }
      if (node.type === "tag") {
        const localStyles = [...currentStyles];

        if (node.name === "span") {
          localStyles.push(...parseInlineStyles(node.attribs?.style));
        } else if (node.name === "strong" || node.name === "b") {
          localStyles.push(styles.bold);
        } else if (node.name === "em" || node.name === "i") {
          localStyles.push(styles.italic);
        }

        return (
          <Text
            key={`inline-${node.name}-${idx.toString()}`}
            style={localStyles}>
            {processInlineContent(node.children, localStyles)}
          </Text>
        );
      }
      return "";
    });
  };

  // Layout-level structure processing engine
  const traverseNodes = (
    nodes: any[],
    listContext: { type: string; counter: number } | null = null,
  ): any => {
    return nodes.map((node, idx) => {
      if (node.type === "tag") {
        const uniqueKey = `${node.name}-${idx}`;
        const inlineStyles = parseInlineStyles(node.attribs?.style);

        switch (node.name) {
          case "p": {
            const textContent = processInlineContent(node.children);
            // Ignore empty workspace break nodes generated from Tiptap configurations
            if (
              !textContent ||
              (Array.isArray(textContent) && textContent.join("").trim() === "")
            ) {
              return null;
            }
            return (
              <View key={uniqueKey} style={styles.htmlParagraph}>
                <Text style={inlineStyles}>{textContent}</Text>
              </View>
            );
          }

          case "ol":
            return (
              <View key={uniqueKey} style={styles.htmlListBlock}>
                {traverseNodes(node.children, { type: "ol", counter: 0 })}
              </View>
            );

          case "ul":
            return (
              <View key={uniqueKey} style={styles.htmlListBlock}>
                {traverseNodes(node.children, { type: "ul", counter: 0 })}
              </View>
            );

          case "li":
            if (listContext) {
              if (listContext.type === "ol") {
                listContext.counter += 1;
              }
              const bulletPrefix =
                listContext.type === "ol" ? `${listContext.counter}.` : "•";

              return (
                <View key={uniqueKey} style={styles.htmlListItemRow}>
                  <Text style={[{ fontSize: 10, width: 15 }, ...inlineStyles]}>
                    {bulletPrefix}
                  </Text>
                  <View style={styles.htmlListItemContent}>
                    {node.children?.some((c: any) => c.name === "p") ? (
                      traverseNodes(node.children, null)
                    ) : (
                      <Text style={inlineStyles}>
                        {processInlineContent(node.children)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }
            return (
              <View key={uniqueKey}>
                {traverseNodes(node.children, listContext)}
              </View>
            );

          default:
            return node.children
              ? traverseNodes(node.children, listContext)
              : null;
        }
      }
      return null;
    });
  };

  const parsedDom = html_parser(htmlContent);
  return <>{traverseNodes(parsedDom)}</>;
};

export const AdmissionLetterTemplate = (
  props: AdmissionLetterTemplateProps,
) => {
  const logoPath = `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/logo.png`;
  const HeadSign = `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/Head-signature.jpg`;
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBar} />

      <View style={styles.letterhead}>
        <View style={styles.schoolNameGroup}>
          <Text style={styles.school}>Presbyterian SHTS - Nakpanduri</Text>
          <Text style={styles.slug}>Npresec</Text>
        </View>
        <View style={styles.letterheadGrid}>
          <View style={[styles.letterheadGridText, { textAlign: "left" }]}>
            <Text>Email: admin@nakpanduripresec.org</Text>
            <Text>Website:nakpanduripresec.org</Text>
            <Text>GPS: MP-3396-0858</Text>
          </View>
          <View style={{ width: "50%" }}>
            <View style={styles.logoContainer}>
              <Image src={logoPath} source={logoPath} style={styles.logo} />
            </View>
          </View>
          <View style={[styles.letterheadGridText, { textAlign: "right" }]}>
            <Text style={{ textAlign: "right" }}>
              Postal Address: P.O. Box 22
            </Text>
            <Text style={{ textAlign: "right" }}>
              Location: Nakpanduri, NE/R, Ghana
            </Text>
            <Text style={{ textAlign: "right" }}>Phone: +233244869633</Text>
          </View>
        </View>
      </View>
      <View style={styles.admissionRef}>
        <View
          style={{ paddingHorizontal: 5, paddingVertical: 5, width: "50%" }}>
          <Text style={styles.admissionRefTextTitle}>Student Number</Text>
          <Text>{props.admissionReference}</Text>
        </View>
        <View style={styles.admissionRefGroup}>
          <Text style={styles.admissionRefTextTitle}>Academic Year</Text>
          <Text>
            {new Date().getFullYear()}/{new Date().getFullYear() + 1}
          </Text>
        </View>
        <View style={styles.admissionRefGroup}>
          <Text style={styles.admissionRefTextTitle}>Date Issued</Text>
          <Text>
            {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(
              new Date(),
            )}
          </Text>
        </View>
      </View>
      <View style={styles.salutation}>
        <Text style={{ fontSize: 10 }}>
          Dear{" "}
          <Text style={{ fontWeight: 800, textTransform: "capitalize" }}>
            {props.studentName}
          </Text>
          ,
        </Text>
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            textAlign: "center",
            textDecoration: "underline",
          }}>
          {props.templateData.documentHeading}
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 5 }}>
        <RenderHtmlString htmlContent={props.templateData.intro} />

        <Text
          style={{
            lineHeight: 1.5,
            fontWeight: 800,
            fontSize: 10,
            marginTop: 4,
          }}>
          Admission Details
        </Text>
        <View>
          <View style={styles.admissionDetails}>
            <Text style={styles.admissionDetailsTitle}>Full Name:</Text>
            <Text style={styles.admissionDetailsValue}>
              {props.studentName}
            </Text>
          </View>
          <View style={styles.admissionDetails}>
            <Text style={styles.admissionDetailsTitle}>
              Residential Status:
            </Text>
            <Text style={styles.admissionDetailsValue}>
              {props.residentialStatus}
            </Text>
          </View>
          <View style={styles.admissionDetails}>
            <Text style={styles.admissionDetailsTitle}>Programme:</Text>
            <Text style={styles.admissionDetailsValue}>{props.programme}</Text>
          </View>
          <View style={styles.admissionDetails}>
            <Text style={styles.admissionDetailsTitle}>Class Assigned:</Text>
            <Text style={styles.admissionDetailsValue}>
              {props.selectedClass}
            </Text>
          </View>
          <View style={styles.admissionDetails}>
            <Text style={styles.admissionDetailsTitle}>House Assigned:</Text>
            <Text style={styles.admissionDetailsValue}>
              {props.houseAllocated}
            </Text>
          </View>
        </View>
        {props.templateData.instructions && (
          <View
            style={{
              marginTop: 5,
              border: "1px solid #979dac",
              borderLeft: "3px solid #4361ee",
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: "#f8f9fa",
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                textDecoration: "underline",
                lineHeight: 2,
              }}>
              Important Instructions
            </Text>
            <RenderHtmlString htmlContent={props.templateData.instructions} />
          </View>
        )}
        <View style={{ marginTop: 5, fontSize: 10, lineHeight: 1.5 }}>
          {props.templateData.conclusion ? (
            <RenderHtmlString htmlContent={props.templateData.conclusion} />
          ) : (
            <>
              <Text>
                This offer is conditional upon the verification of your Basic
                Education Certificate Examination (BECE) results.
              </Text>
              <Text>
                Congratulations on your placement. We look forward to welcoming
                you to our academic community.
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Image
            src={HeadSign}
            source={HeadSign}
            style={{ width: 180, marginLeft: -10 }}
          />
          <Svg style={styles.svgWrapper}>
            <Line
              x1="0"
              y1="5"
              x2="180"
              y2="5"
              stroke="#A0AEC0"
              strokeWidth={1}
            />
          </Svg>
          <Text style={styles.titleText}>Mohammed Michael Issah</Text>
          <Text style={styles.subText}>Headmaster</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={{ fontSize: 8, textTransform: "uppercase" }}>
            Scan to Verify
          </Text>
          <Link
            href={props.verificationLink}
            style={{ border: "2px solid #A0AEC0", borderRadius: 4 }}>
            <Image
              src={props.qrcodeUrl}
              source={props.qrcodeUrl}
              style={{ width: 70, height: 70 }}
            />
          </Link>
        </View>
      </View>
    </Page>
  );
};
