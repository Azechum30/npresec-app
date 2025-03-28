import Link from "next/link";

export default function Home() {
	const Links = [
		{
			title: "Home",
			href: "/"
		},
		{
			title: "About",
			href: "/about"
		},
		{
			title: "Admissions",
			href: "/admissions"
		},
		{
			title: "Create an Acount",
			href: "/authenticate"
		}
	];
	return <div>Home Page</div>;
}
