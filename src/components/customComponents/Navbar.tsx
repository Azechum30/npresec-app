import Link from "next/link";
import LinkWithStyles from "./LinkWithStyles";

export default function Navbar() {
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
			title: "Login",
			href: "/authenticate"
		}
	];
	return (
		<header className='border-b dark:border-gray-700 sticky top-0 left-0 h-16 flex items-center backdrop-blur-lg z-40'>
			<nav className='w-full max-w-5xl mx-auto '>
				<ul className=' w-full flex flex-col md:flex-row  '>
					{Links.map((link) => (
						<li
							key={link.href}
							className='first-of-type:mr-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
						>
							<LinkWithStyles
								href={link.href}
								title={link.title}
								className='text-sm'
							/>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
