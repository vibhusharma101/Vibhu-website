import { AboutMe } from '@/components/aboutme/AboutMe';
import { ChatPopover } from '@/components/hero/ChatPopover';
import { HeroText } from '@/components/hero/HeroText';
import { MyProjects } from '@/components/myprojects/MyProjects';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import WorkEx from '@/components/workex/WorkEx';

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <HeroText />
        <WorkEx />
        <MyProjects />
        <AboutMe />
      </main>
      <Footer />
      <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 100 }}>
        <ChatPopover />
      </div>
    </div>
  );
}
