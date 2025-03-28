"use server"

import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import { DepartmentSelect } from "@/lib/types"

export const getServerSideProps = async () => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")

		const data = await prisma.department.findMany({
			select: DepartmentSelect,
			orderBy: {
				createdAt: "desc"
			}
		})

		if (!data) {
			return { success: false, error: "No row found!" }
		}

		return { success: true, data }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong!" }
	}
}
