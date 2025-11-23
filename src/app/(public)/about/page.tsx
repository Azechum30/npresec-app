import { PublicMainContainer } from "../_components/PublicMainContainer";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium relative pb-2 after:absolute after:z-0 after:bottom-0 after:w-1/12 inset-0 after:border-b-2 after:border-primary after:flex after:justify-start text-primary">
        Brief History
      </h2>
      <p className="lg:max-w-prose lg:text-justify">
        Nakpanduri Presbyterian Senior High Technical School (NPRESEC) stands as
        a beacon of transformation and educational growth, officially
        established in 2010 after undergoing several transitional phases.
      </p>
      <p className="lg:max-w-prose lg:text-justify">
        The institution traces its origins to 1981, when the Presbyterian Church
        of Ghana founded the Agricultural Rehabilitation Center for the Blind
        (ARB). This initiative served the community until its closure in 1991.
        In response to the collapse of the ARB, the Church repurposed the
        facility to launch the Nakpanduri Presbyterian Junior High School (JHS)
        in 1992, continuing its commitment to education and social development.
      </p>
      <p className="lg:max-w-prose lg:text-justify">
        In 2010, the site was restructured into a Vocational Training Institute.
        However, due to low enrolment, the institution was converted into a
        Senior High Technical School (SHTS) during the 2012/2013 academic year.
        At inception, the school enrolled 97 students—57 boys and 40
        girls—marking a significant milestone in its evolution
      </p>
      <p className="lg:max-w-prose lg:text-justify">
        The first cohort of SHTS candidates sat for the West African Senior
        School Certificate Examination (WASSCE) at Golden Step SHS in
        Bolgatanga, as the school was yet to receive full accreditation. In
        2015, NPRESEC was officially accredited by the National Accreditation
        Board of Ghana as a Private Senior High Technical School, operating
        independently until its absorption by the Government in February 2022.
      </p>
      <p className="lg:max-w-prose lg:text-justify">
        Following its transition to a Government-Assisted Senior High Technical
        School, Mr. Mohammed Michael Issah was appointed as the first Headmaster
        under government administration. The school commenced the 2021/2022
        academic year with a student population of fifty-eight (58), marking a
        new chapter in its journey toward excellence and inclusive education.
      </p>
    </div>
  );
}
