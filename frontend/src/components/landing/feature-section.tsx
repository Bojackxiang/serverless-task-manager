import type { ReactNode } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  imagePosition: "left" | "right";
  icon: ReactNode;
  illustration: ReactNode;
}

export function FeatureSection({
  title,
  description,
  imagePosition,
  icon,
  illustration,
}: FeatureSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div
          className={`flex flex-col gap-12 items-center ${
            imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              {icon}
            </div>
            <h2 className="font-bold text-3xl lg:text-4xl text-balance">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
              {description}
            </p>
          </div>

          <div className="flex-1 w-full">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 border border-border flex items-center justify-center p-8">
              {illustration}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
