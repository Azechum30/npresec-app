// import { prisma } from "@/lib/prisma";
// import { Level, LevelProgression, PromotionCriteria } from "@/lib/constants";
// import { Level as PrismaLevel, EnrollmentStatus } from "@/generated/prisma/client";

// /**
//  * Promotion criteria for student advancement
//  */
// export interface PromotionCriteriaResult {
//   eligible: boolean;
//   reasons: string[];
//   gpa: number;
//   attendancePercentage: number;
//   failedCourses: number;
// }

// /**
//  * Promotion result for a single student
//  */
// export interface StudentPromotionResult {
//   studentId: string;
//   studentName: string;
//   currentLevel: Level;
//   newLevel: Level | null;
//   eligible: boolean;
//   criteria: PromotionCriteriaResult;
//   promoted: boolean;
//   error?: string;
// }

// /**
//  * Bulk promotion result
//  */
// export interface BulkPromotionResult {
//   totalStudents: number;
//   eligibleStudents: number;
//   promotedStudents: number;
//   graduatedStudents: number;
//   failedPromotions: number;
//   results: StudentPromotionResult[];
// }

// /**
//  * Calculate student's GPA for a given academic year
//  */
// export async function calculateStudentGPA(
//   studentId: string,
//   academicYear: number,
//   semester?: "First" | "Second"
// ): Promise<number> {
//   const grades = await prisma.grade.findMany({
//     where: {
//       studentId,
//       academicYear,
//       ...(semester && { semester }),
//       isExempt: false,
//     },
//     include: {
//       course: true,
//     },
//   });

//   if (grades.length === 0) return 0;

//   // Group grades by course
//   const courseGrades = new Map<string, typeof grades>();

//   grades.forEach((grade) => {
//     if (!courseGrades.has(grade.courseId)) {
//       courseGrades.set(grade.courseId, []);
//     }
//     courseGrades.get(grade.courseId)!.push(grade);
//   });

//   // Calculate GPA using weighted average
//   let totalWeightedScore = 0;
//   let totalCredits = 0;

//   for (const [courseId, courseGradesList] of courseGrades) {
//     const course = courseGradesList[0].course;
//     const credits = course.credits || 1;

//     // Calculate course average
//     const courseAverage = courseGradesList.reduce((sum, grade) => {
//       const weight = grade.weight || 1.0;
//       return sum + (grade.score / grade.maxScore) * weight;
//     }, 0) / courseGradesList.length;

//     // Convert to 4.0 scale (Ghanaian system)
//     const gradePoint = courseAverage >= 0.8 ? 4.0 :
//                       courseAverage >= 0.7 ? 3.0 :
//                       courseAverage >= 0.6 ? 2.0 :
//                       courseAverage >= 0.5 ? 1.0 : 0.0;

//     totalWeightedScore += gradePoint * credits;
//     totalCredits += credits;
//   }

//   return totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
// }

// /**
//  * Calculate student's attendance percentage for a given academic year
//  */
// export async function calculateAttendancePercentage(
//   studentId: string,
//   academicYear: number
// ): Promise<number> {
//   const attendanceRecords = await prisma.attendance.findMany({
//     where: {
//       studentId,
//       academicYear: academicYear.toString(),
//     },
//   });

//   if (attendanceRecords.length === 0) return 100;

//   const presentCount = attendanceRecords.filter(
//     (record) => record.status === "Present"
//   ).length;

//   return (presentCount / attendanceRecords.length) * 100;
// }

// /**
//  * Check if a student meets promotion criteria
//  */
// export async function checkPromotionCriteria(
//   studentId: string,
//   currentLevel: Level,
//   academicYear: number
// ): Promise<PromotionCriteriaResult> {
//   const reasons: string[] = [];

//   // Calculate GPA
//   const gpa = await calculateStudentGPA(studentId, academicYear);

//   // Calculate attendance
//   const attendancePercentage = await calculateAttendancePercentage(studentId, academicYear);

//   // Check for failed courses (courses with score < 50%)
//   const failedGrades = await prisma.grade.findMany({
//     where: {
//       studentId,
//       academicYear,
//       score: {
//         lt: 50, // Assuming 50% is pass mark
//       },
//       maxScore: 100,
//       isExempt: false,
//     },
//     include: {
//       course: true,
//     },
//   });

//   const failedCourses = new Set(failedGrades.map(grade => grade.courseId)).size;

//   // Check criteria
//   const meetsGPA = gpa >= PromotionCriteria.minimumGPA;
//   const meetsAttendance = attendancePercentage >= PromotionCriteria.minimumAttendancePercentage;
//   const meetsFailedCourses = failedCourses <= PromotionCriteria.maximumFailedCourses;

//   if (!meetsGPA) {
//     reasons.push(`GPA ${gpa.toFixed(2)} below minimum ${PromotionCriteria.minimumGPA}`);
//   }

//   if (!meetsAttendance) {
//     reasons.push(`Attendance ${attendancePercentage.toFixed(1)}% below minimum ${PromotionCriteria.minimumAttendancePercentage}%`);
//   }

//   if (!meetsFailedCourses) {
//     reasons.push(`${failedCourses} failed courses exceeds maximum ${PromotionCriteria.maximumFailedCourses}`);
//   }

//   return {
//     eligible: meetsGPA && meetsAttendance && meetsFailedCourses,
//     reasons,
//     gpa,
//     attendancePercentage,
//     failedCourses,
//   };
// }

// /**
//  * Promote a single student
//  */
// export async function promoteStudent(
//   studentId: string,
//   academicYear: number,
//   forcePromotion: boolean = false,
//   promotedBy?: string
// ): Promise<StudentPromotionResult> {
//   try {
//     // Get student details
//     const student = await prisma.student.findUnique({
//       where: { id: studentId },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         currentLevel: true,
//         status: true,
//         classId: true,
//         departmentId: true,
//       },
//     });

//     if (!student) {
//       return {
//         studentId,
//         studentName: "Unknown Student",
//         currentLevel: "Year_One" as Level,
//         newLevel: null,
//         eligible: false,
//         criteria: {
//           eligible: false,
//           reasons: ["Student not found"],
//           gpa: 0,
//           attendancePercentage: 0,
//           failedCourses: 0,
//         },
//         promoted: false,
//         error: "Student not found",
//       };
//     }

//     const studentName = `${student.firstName} ${student.lastName}`;
//     const currentLevel = student.currentLevel as Level;

//     // Check if student can be promoted
//     if (student.status !== "Active") {
//       return {
//         studentId,
//         studentName,
//         currentLevel,
//         newLevel: null,
//         eligible: false,
//         criteria: {
//           eligible: false,
//           reasons: [`Student status is ${student.status}`],
//           gpa: 0,
//           attendancePercentage: 0,
//           failedCourses: 0,
//         },
//         promoted: false,
//       };
//     }

//     // Check promotion criteria
//     const criteria = await checkPromotionCriteria(studentId, currentLevel, academicYear);

//     // Determine eligibility
//     const eligible = forcePromotion || criteria.eligible;

//     if (!eligible) {
//       return {
//         studentId,
//         studentName,
//         currentLevel,
//         newLevel: null,
//         eligible: false,
//         criteria,
//         promoted: false,
//       };
//     }

//     // Determine new level
//     const newLevel = LevelProgression[currentLevel];

//     // Record promotion in database
//     await prisma.studentPromotion.create({
//       data: {
//         studentId,
//         fromLevel: currentLevel,
//         toLevel: newLevel || undefined,
//         academicYear,
//         promotedBy,
//         criteria: {
//           gpa: criteria.gpa,
//           attendancePercentage: criteria.attendancePercentage,
//           failedCourses: criteria.failedCourses,
//           reasons: criteria.reasons,
//         },
//         forcePromoted: forcePromotion,
//         notes: forcePromotion ? "Force promoted" : "Automatically promoted",
//       },
//     });

//     if (!newLevel) {
//       // Student is graduating
//       await prisma.student.update({
//         where: { id: studentId },
//         data: {
//           status: "Graduated" as EnrollmentStatus,
//           graduationDate: new Date(),
//         },
//       });

//       return {
//         studentId,
//         studentName,
//         currentLevel,
//         newLevel: null,
//         eligible: true,
//         criteria,
//         promoted: true,
//       };
//     }

//     // Promote student to next level
//     await prisma.student.update({
//       where: { id: studentId },
//       data: {
//         currentLevel: newLevel as PrismaLevel,
//         // Clear class assignment - will be reassigned separately
//         classId: null,
//       },
//     });

//     return {
//       studentId,
//       studentName,
//       currentLevel,
//       newLevel,
//       eligible: true,
//       criteria,
//       promoted: true,
//     };

//   } catch (error) {
//     console.error(`Error promoting student ${studentId}:`, error);

//     return {
//       studentId,
//       studentName: "Unknown Student",
//       currentLevel: "Year_One" as Level,
//       newLevel: null,
//       eligible: false,
//       criteria: {
//         eligible: false,
//         reasons: ["System error occurred"],
//         gpa: 0,
//         attendancePercentage: 0,
//         failedCourses: 0,
//       },
//       promoted: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

// /**
//  * Promote all eligible students from a specific level
//  */
// export async function promoteStudentsByLevel(
//   fromLevel: Level,
//   academicYear: number,
//   forcePromotion: boolean = false,
//   promotedBy?: string
// ): Promise<BulkPromotionResult> {
//   try {
//     // Get all active students in the specified level
//     const students = await prisma.student.findMany({
//       where: {
//         currentLevel: fromLevel as PrismaLevel,
//         status: "Active" as EnrollmentStatus,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//       },
//     });

//     const results: StudentPromotionResult[] = [];
//     let promotedCount = 0;
//     let graduatedCount = 0;
//     let failedCount = 0;

//     // Process each student
//     for (const student of students) {
//       const result = await promoteStudent(student.id, academicYear, forcePromotion, promotedBy);
//       results.push(result);

//       if (result.promoted) {
//         if (result.newLevel) {
//           promotedCount++;
//         } else {
//           graduatedCount++; // Graduated from Year_Three
//         }
//       } else if (result.error) {
//         failedCount++;
//       }
//     }

//     return {
//       totalStudents: students.length,
//       eligibleStudents: results.filter(r => r.eligible).length,
//       promotedStudents: promotedCount,
//       graduatedStudents: graduatedCount,
//       failedPromotions: failedCount,
//       results,
//     };

//   } catch (error) {
//     console.error("Error in bulk promotion:", error);
//     throw new Error(`Bulk promotion failed: ${error instanceof Error ? error.message : "Unknown error"}`);
//   }
// }

// /**
//  * Get promotion preview for a specific level
//  */
// export async function getPromotionPreview(
//   fromLevel: Level,
//   academicYear: number
// ): Promise<StudentPromotionResult[]> {
//   try {
//     const students = await prisma.student.findMany({
//       where: {
//         currentLevel: fromLevel as PrismaLevel,
//         status: "Active" as EnrollmentStatus,
//       },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//       },
//     });

//     const results: StudentPromotionResult[] = [];

//     for (const student of students) {
//       const criteria = await checkPromotionCriteria(student.id, fromLevel, academicYear);

//       results.push({
//         studentId: student.id,
//         studentName: `${student.firstName} ${student.lastName}`,
//         currentLevel: fromLevel,
//         newLevel: LevelProgression[fromLevel],
//         eligible: criteria.eligible,
//         criteria,
//         promoted: false,
//       });
//     }

//     return results;

//   } catch (error) {
//     console.error("Error getting promotion preview:", error);
//     throw new Error(`Failed to get promotion preview: ${error instanceof Error ? error.message : "Unknown error"}`);
//   }
// }

// /**
//  * Auto-assign students to appropriate classes after promotion
//  */
// export async function autoAssignClassesAfterPromotion(
//   studentIds: string[],
//   newLevel: Level,
//   departmentId?: string
// ): Promise<{ assigned: number; failed: number }> {
//   try {
//     let assigned = 0;
//     let failed = 0;

//     // Find available classes for the new level
//     const availableClasses = await prisma.class.findMany({
//       where: {
//         level: newLevel as PrismaLevel,
//         ...(departmentId && { departmentId }),
//       },
//       select: {
//         id: true,
//         name: true,
//         code: true,
//         _count: {
//           select: {
//             students: true,
//           },
//         },
//       },
//       orderBy: {
//         students: {
//           _count: "asc", // Prefer classes with fewer students
//         },
//       },
//     });

//     if (availableClasses.length === 0) {
//       return { assigned: 0, failed: studentIds.length };
//     }

//     // Distribute students across available classes
//     for (let i = 0; i < studentIds.length; i++) {
//       const classIndex = i % availableClasses.length;
//       const targetClass = availableClasses[classIndex];

//       try {
//         await prisma.student.update({
//           where: { id: studentIds[i] },
//           data: { classId: targetClass.id },
//         });
//         assigned++;
//       } catch (error) {
//         console.error(`Failed to assign student ${studentIds[i]} to class ${targetClass.id}:`, error);
//         failed++;
//       }
//     }

//     return { assigned, failed };

//   } catch (error) {
//     console.error("Error in auto-assigning classes:", error);
//     return { assigned: 0, failed: studentIds.length };
//   }
// }
