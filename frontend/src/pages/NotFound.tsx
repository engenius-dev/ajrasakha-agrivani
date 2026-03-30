import { useLocation, Link } from "react-router-dom"; // CHANGED: Added Link
import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Added Button for consistent styling

/**
 * NotFound Component
 * Catches any undefined routes (404 errors) and provides a safe path back to the application.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Helpful for debugging broken links during the hackathon
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-display font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Oops! The page you are looking for does not exist.</p>
        
        {/* CHANGED: Using <Link> instead of <a> prevents a hard page reload */}
        <Link to="/">
          <Button size="lg" className="mt-4 text-lg rounded-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;