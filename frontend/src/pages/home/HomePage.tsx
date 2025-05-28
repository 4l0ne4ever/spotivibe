import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { useUser } from "@clerk/clerk-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const { user } = useUser();
  const [greeting, setGreeting] = useState(getTheme().greeting);
  const [gradient, setGradient] = useState(getTheme().gradient);
  const {
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYou,
    isLoading,
    madeForYou,
    trendingSongs,
    featuredSongs,
  } = useMusicStore();
  useEffect(() => {
    fetchFeaturedSongs();
    fetchTrendingSongs();
    fetchMadeForYou();
  }, [fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYou]);
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    if (
      madeForYou.length > 0 &&
      trendingSongs.length > 0 &&
      featuredSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...trendingSongs, ...madeForYou];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYou, trendingSongs, featuredSongs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { greeting, gradient } = getTheme();
      setGreeting(greeting);
      setGradient(gradient);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className={`rounded-md overflow-hidden h-full ${gradient}`}>
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good {greeting}!
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title={`Made for ${user?.firstName ?? "You"}`}
              songs={madeForYou}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
//TODO: get Theme colors based on the image of the song currently playing
const getTheme = () => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12)
    return {
      greeting: "Morning",
      gradient: "bg-gradient-to-b from-slate-600 via-slate-800 to-zinc-900",
    };
  if (hour >= 12 && hour < 18)
    return {
      greeting: "Afternoon",
      gradient: "bg-gradient-to-b from-blue-800 via-slate-800 to-zinc-900",
    };
  if (hour >= 18 && hour < 24)
    return {
      greeting: "Evening",
      gradient: "bg-gradient-to-b from-orange-800 via-red-900 to-zinc-900",
    };
  return {
    greeting: "Night",
    gradient: "bg-gradient-to-b from-slate-700 via-slate-800 to-zinc-900",
  };
};
