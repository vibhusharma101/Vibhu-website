import { ChatPopover } from "@/components/hero/ChatPopover";
import { HeroText } from "@/components/hero/HeroText";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { Affix, Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack>
      <Header />
      <HeroText />
      <Footer />
      <Affix position={{ bottom: 40, right: 40 }}>
        <ChatPopover />
      </Affix>
    </Stack>
  );
}
