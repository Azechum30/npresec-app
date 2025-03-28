import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DepartmentResponseType } from "@/lib/types"
import { Badge } from "../ui/badge"
import { BadgeCheck } from "lucide-react"

type RowDetailComponentProps = {
	row: DepartmentResponseType
}

export default function RowDetailedComponent({ row }: RowDetailComponentProps) {
	return (
		<Card className='border-none rounded-none'>
			<CardHeader>
				<CardTitle className='flex flex-col md:flex-row space-y-3 md:space-y-0 md:justify-between'>
					<span className='uppercase tracking-wider'>
						Name: {row.name}
					</span>
					<Badge className='rounded-md'>
						<BadgeCheck className='size-5 mr-1' />
						Code: {row.code}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className='leading-loose'>
				{row.description}
			</CardContent>
		</Card>
	)
}
