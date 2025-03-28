import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type TabSwitcherProps = {
	signin: ReactNode;
	signup: ReactNode;
	className?: string;
};

export default function TabSwitcher({
	signin,
	signup,
	className
}: TabSwitcherProps) {
	return (
		<Tabs
			defaultValue='sign-in'
			className={className}
		>
			<TabsList className='w-full max-w-md'>
				<TabsTrigger
					value='sign-in'
					className='w-full text-base'
				>
					Sign In
				</TabsTrigger>
				<TabsTrigger
					value='sign-up'
					className='w-full text-base'
				>
					Sign Up
				</TabsTrigger>
			</TabsList>
			<TabsContent value='sign-in'>{signin}</TabsContent>
			<TabsContent value='sign-up'>{signup}</TabsContent>
		</Tabs>
	);
}
