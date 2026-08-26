import { Hero } from "@/app/_home/Hero";
import { PropertyListing } from "@/components/property/PropertyListing";
import { CategoryShortcuts } from "@/app/_home/CategoryShortcuts";
import { CondoBanner } from "@/app/_home/CondoBanner";
import { ListPropertyCta } from "@/app/_home/ListPropertyCta";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6">
      <Hero />

      <section className="flex flex-col gap-4 py-8">
        <h2 className="text-2xl font-semibold text-text-primary">
          Selecionados para hoje
        </h2>
        <PropertyListing limit={4} />
      </section>

      <CategoryShortcuts />
      <CondoBanner />
      <ListPropertyCta />
    </div>
  );
}
