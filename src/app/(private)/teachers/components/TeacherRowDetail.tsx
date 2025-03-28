import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { TableCell, TableRow } from "@/components/ui/table"
import { TeacherResponseType } from "@/lib/types"
import { Row } from "@tanstack/react-table"
import { BadgeCent } from "lucide-react"

type TeacherRowDetailProp = {
	row: Row<TeacherResponseType>
}
export default function TeacherRowDetail({ row }: TeacherRowDetailProp) {
	return (
		<TableRow>
			<TableCell colSpan={row.getVisibleCells().length}>
				<Card className='rounded-none border-none'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center mb-5'>
							<h1 className='uppercase'>
								Profile Details of{" "}
								{`${row.original.firstName} ${row.original.lastName}`}
							</h1>
							<Badge
								variant='default'
								className='hover:cursor-pointer'
							>
								<BadgeCent className='size-5 mr-1' />
								<span>STAFF ID: {row.original.employeeId}</span>
							</Badge>
						</CardTitle>
						<CardDescription className='mt-4'>
							This contains a detailed description of{" "}
							<span className='text-primary-foreground'>
								{`${row.original.lastName} ${row.original.firstName} ${row.original.middleName}`}
								,
							</span>{" "}
							including the department to which{" "}
							<span>
								{row.original.gender === "Male" ? "he" : "she"}
							</span>{" "}
							belongs, the classes{" "}
							<span>
								{row.original.gender === "Male" ? "he" : "she"}
							</span>{" "}
							teaches, and other additional responsibilities
							assigned to{" "}
							<span>
								{row.original.gender === "Male" ? "him" : "her"}
							</span>{" "}
							by the Headmaster and his Management Board. Peruse
							this detail section to obtain all the necessary
							information about{" "}
							<span>{row.original.firstName}</span>.
						</CardDescription>
					</CardHeader>
				</Card>
			</TableCell>
		</TableRow>
	)
}
