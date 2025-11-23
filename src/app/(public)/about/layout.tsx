import { AboutHeader } from "./_components/AboutHeader";
import { PublicMainContainer } from "../_components/PublicMainContainer";
import { AboutSidebar } from "./_components/AboutSidebar";
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AboutHeader />
      <div className="px-4 md:px-6 lg:px-8 bg-accent">
        <PublicMainContainer className="py-12">
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-4 ">
            <div className="flex-1 lg:flex-3">{children}</div>
            <div className="w-full lg:w-2/6 lg:h-[450px]">
              <AboutSidebar />
            </div>
          </div>
        </PublicMainContainer>
      </div>
    </div>
  );
}
