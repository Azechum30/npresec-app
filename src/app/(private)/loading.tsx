import RouteLoadingSpinner from "@/components/customComponents/RouteLoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4 p-8">
        <RouteLoadingSpinner
          message="Loading dashboard..."
          size="lg"
          className="py-4"
        />

        {/* Optional skeleton for better perceived performance */}
        <div className="animate-pulse space-y-3 w-80">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
