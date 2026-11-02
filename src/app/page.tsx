import { getPortfolio } from "@/controllers/portfolio.controller";
import BuildInfo from "@/views/components/BuildInfo";
import CityBackdrop from "@/views/components/CityBackdrop";
import ContactModal from "@/views/components/ContactModal";
import HoloCall from "@/views/components/HoloCall";
import Terminal from "@/views/components/Terminal";
import About from "@/views/sections/About";
import Contact from "@/views/sections/Contact";
import Education from "@/views/sections/Education";
import Experience from "@/views/sections/Experience";
import Footer from "@/views/sections/Footer";
import Hero from "@/views/sections/Hero";
import Nav from "@/views/sections/Nav";
import Projects from "@/views/sections/Projects";
import Skills from "@/views/sections/Skills";

// Route = entry point: ask the controller for the view model, hand it to the views.
export default async function Home() {
  const vm = await getPortfolio();

  return (
    <>
      <CityBackdrop media={vm.media} />
      <Nav />
      <main>
        <Hero profile={vm.profile} orbit={vm.orbit} media={vm.media} />
        <About profile={vm.profile} repoCount={vm.github.publicRepos} media={vm.media} />
        <Experience items={vm.experiences} />
        <Projects projects={vm.projects} moreRepos={vm.moreRepos} />
        <Skills groups={vm.skills} />
        <Education education={vm.education} certifications={vm.certifications} />
        <Contact profile={vm.profile} />
      </main>
      <Footer profile={vm.profile} />
      <HoloCall media={vm.media} />
      <Terminal vm={vm} />
      <BuildInfo readme={vm.readme} repoUrl={vm.profile.links.repo} />
      <ContactModal email={vm.profile.email} />
    </>
  );
}
