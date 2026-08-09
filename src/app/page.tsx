import { WeddingApp } from "@/components/WeddingApp/WeddingApp";
import { guests } from "@/data/guests";

export default function Home() {
  return <WeddingApp guests={guests} />;
}
