import { rankItem } from "@tanstack/match-sorter-utils"
import { FilterFn } from "@tanstack/react-table"

export const fuzzyFilter: FilterFn<any> = (row, columndId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columndId), value)

	addMeta({ itemRank })

	return itemRank.passed
}
