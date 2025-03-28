import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import ThemeProvider from "@/components/customComponents/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "600", "700", "900"]
})
export const metadata: Metadata = {
	title: "Nakpanduri Presby SHTS",
	description:
		"A modern and intuitive school management information system built with top-edge technologies an intuitive experience"
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body className={`${poppins.className} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<Toaster
						richColors
						duration={5000}
					/>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
