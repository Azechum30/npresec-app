export const generateAcademicYear =(date: Date)=>{
	const startDate = new Date(date).getMonth() > 9  ? new Date(date).getFullYear()  : new Date(date).getFullYear()- 1
	const endDate = new Date(date).getMonth() > 9 ? new Date(date).getFullYear() + 1 : new Date(date).getFullYear();

	return `${startDate}/${endDate}`
}