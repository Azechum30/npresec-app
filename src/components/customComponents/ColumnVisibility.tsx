import { ChevronDown, Columns3 } from "lucide-react"
import { Button } from "../ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Fragment } from "react"
import { cn } from "@/lib/utils"

export default function ColumnVisibility({
	table,
	className
}: {
	table: any
	className?: string
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					className={cn("max-w-[9.5rem]", className)}
				>
					<Columns3 className='size-4' /> Columns{" "}
					<ChevronDown className='size-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='center'
				className='min-w-[8rem]'
			>
				<DropdownMenuLabel className='text-xs'>
					Column List
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter((column: any) => column.getCanHide())
					.map((column: any, index: number) => (
						<Fragment key={column.id}>
							<DropdownMenuCheckboxItem
								checked={column.getIsVisible()}
								onCheckedChange={(value) =>
									column.toggleVisibility(!!value)
								}
								className='w-full hover:cursor-pointer text-left capitalize'
							>
								{column.id}
							</DropdownMenuCheckboxItem>
							{index !==
								table
									.getAllColumns()
									.slice(1, table.getAllColumns().length - 3)
									.length && <DropdownMenuSeparator />}
						</Fragment>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
