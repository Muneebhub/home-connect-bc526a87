import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, TrendingUp, Shield, Plus } from 'lucide-react';
import Header from '@/components/Header';
import heroImage from '@/assets/hero-property.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleListProperty = () => {
    if (!user) {
      navigate('/auth');
    } else if (userRole === 'seller') {
      navigate('/create-property');
    } else {
      toast({
        title: "Seller Account Required",
        description: "Please create a seller account to list properties.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Discover the perfect home or investment opportunity
          </p>
          <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link to="/properties">
              <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={handleListProperty}
              className="text-lg px-8 bg-gradient-to-r from-secondary via-secondary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose PropertyHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Find properties that match your exact needs with our powerful search and filtering tools.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All properties are verified and reviewed to ensure quality and authenticity.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of buyers and sellers on PropertyHub today
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 border-t">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 PropertyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}