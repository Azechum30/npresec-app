import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, ArrowRight } from "lucide-react";
import { getBoardOfGovernors } from "./actions/server";
import { BoardMembers } from "./_components/board-members";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { BoardOfGovernorsClient } from "./_components/BoardOfGovernorsClient";

function ModernFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card
          key={item}
          className="relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/80 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded-full mb-2 animate-pulse" />
                <div className="h-3 bg-muted/80 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted/60 rounded-full animate-pulse" />
              <div className="h-3 bg-muted/60 rounded-full w-4/5 animate-pulse" />
              <div className="h-3 bg-muted/60 rounded-full w-3/4 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ModernErrorComponent({ error }: { error: string }) {
  return (
    <Card className="bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20 backdrop-blur-xl border-red-200/50 dark:border-red-800/50">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
          Unable to Load Board Members
        </h3>
        <p className="text-red-600/80 dark:text-red-400/80 mb-4">{error}</p>
        <Button
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/20"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BoardOfGovernorsPage() {
  return (
    <BoardOfGovernorsClient>
      <div className="board-members-section">
        <Card className="relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50 shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Meet Our Board Members
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mb-4" />
            <p className="text-muted-foreground">
              Click on any member to learn more about their background,
              expertise, and contributions to our school.
            </p>
          </div>

          <CardContent className="p-6 md:p-8">
            <Suspense fallback={<ModernFallback />}>
              <RenderBoardMembers />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl border-border/50">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Connect With Leadership</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our Board of Governors welcomes feedback and engagement from the
            school community. Reach out to learn more about our governance.
          </p>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Board
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </BoardOfGovernorsClient>
  );
}

const RenderBoardMembers = async () => {
  const { boardMembers, error } = await getBoardOfGovernors();

  if (error) {
    return <ModernErrorComponent error={error} />;
  }

  if (!boardMembers || boardMembers.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-accent/30 to-muted/30 backdrop-blur-xl border-border/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Board Members Found
          </h3>
          <p className="text-muted-foreground/80">
            Board member information is currently being updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {boardMembers.map((member, index) => (
        <div
          key={member.id}
          className="board-member-card opacity-0"
          style={{
            animationDelay: `${index * 0.1}s`,
            animation: "fadeInUp 0.6s ease-out forwards",
          }}
        >
          <BoardMembers {...member} />
        </div>
      ))}
    </div>
  );
};
