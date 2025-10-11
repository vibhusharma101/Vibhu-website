import { AboutMe } from "@/components/aboutme/AboutMe";
import { ChatPopover } from "@/components/hero/ChatPopover";
import { HeroText } from "@/components/hero/HeroText";
import { MyProjects } from "@/components/myprojects/MyProjects";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import WorkEx from "@/components/workex/WorkEx";
import { Affix, Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack>
      <Header />
      <HeroText />
      <WorkEx/>
      <MyProjects/>
      <AboutMe/>
      <Footer />
      <Affix position={{ bottom: 40, right: 40 }}>
        <ChatPopover />
      </Affix>
    </Stack>
  );
}
