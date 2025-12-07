import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <section className="py-20 min-h-[60vh] flex items-center">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-8xl font-display font-bold text-primary mb-6">404</div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
