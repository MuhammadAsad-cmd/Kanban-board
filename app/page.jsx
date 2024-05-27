import MainContent from "./Components/MainContent/MainContent";
import SideNav from "./Components/SideNav/SideNav";

export default function Home() {
  return (
    <div class="h-screen w-full bg-[#f0f0f0] dark:bg-neutral-900 dark:text-neutral-50">
      <SideNav />
      <MainContent />
    </div>
  );
}
