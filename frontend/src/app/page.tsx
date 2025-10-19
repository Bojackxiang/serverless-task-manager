import { CheckCircle2, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { FeatureSection } from "@/components/landing/feature-section";
import {
  CollaborationIllustration,
  ScalingIllustration,
  TaskBoardIllustration,
} from "@/components/landing/illustration";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 lg:py-32">
          <div className="container mx-auto text-center space-y-8">
            <h1 className="font-bold text-4xl lg:text-6xl text-balance max-w-4xl mx-auto">
              Serverless Project Management for Modern Teams
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed text-pretty">
              Experience the power of Jira-like project management without the
              infrastructure overhead. Built for speed, scalability, and
              seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        <div id="features">
          <FeatureSection
            title="Track Progress Effortlessly"
            description="Monitor your team's progress with intuitive boards and real-time updates. Create, assign, and track tasks with ease. Our serverless architecture ensures lightning-fast performance without any maintenance overhead."
            imagePosition="left"
            icon={<CheckCircle2 className="w-6 h-6" />}
            illustration={<TaskBoardIllustration />}
          />

          <FeatureSection
            title="Collaborate Seamlessly"
            description="Bring your team together with powerful collaboration tools. Share updates, comment on tasks, and keep everyone aligned. Built-in notifications ensure no one misses important changes or deadlines."
            imagePosition="right"
            icon={<Users className="w-6 h-6" />}
            illustration={<CollaborationIllustration />}
          />

          <FeatureSection
            title="Scale Without Limits"
            description="Powered by serverless technology, JiraFlow scales automatically with your team's needs. From small startups to enterprise teams, enjoy consistent performance and reliability without worrying about infrastructure."
            imagePosition="left"
            icon={<Zap className="w-6 h-6" />}
            illustration={<ScalingIllustration />}
          />
        </div>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center space-y-6">
            <h2 className="font-bold text-3xl lg:text-4xl text-balance">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Join teams already using JiraFlow to streamline their project
              management.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
