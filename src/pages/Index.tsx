import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, Shield, Plus, Star, CheckCircle, ArrowRight, Sparkles, Building2, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30 z-[1]" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float z-[1]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float z-[1]" style={{ animationDelay: '2s' }} />
        
        <div className="container relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/20 animate-fade-in">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-white/90 font-medium">Pakistan's Premium Property Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Find Your
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Dream Home
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Discover luxury properties across Pakistan. Buy, sell, or rent your perfect home with TUMHARAGHAR - where every house becomes a home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/properties">
              <Button size="lg" className="text-lg px-10 py-7 bg-white text-foreground hover:bg-white/90 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 font-semibold rounded-2xl">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={handleListProperty}
              className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-semibold rounded-2xl animate-pulse-glow"
            >
              <Plus className="mr-2 h-5 w-5" />
              List Your Property
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {[
              { value: '500+', label: 'Properties', icon: Building2 },
              { value: '1000+', label: 'Happy Clients', icon: Users },
              { value: '50+', label: 'Cities', icon: MapPin },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/10 to-transparent" />
        
        <div className="container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-primary font-semibold text-sm">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Experience The
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"> Difference</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TUMHARAGHAR offers unmatched service and the finest properties in Pakistan
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Smart Search',
                description: 'Find your perfect property with our advanced AI-powered search filters and recommendations.',
                color: 'primary',
                delay: '0s'
              },
              {
                icon: Home,
                title: 'Verified Listings',
                description: 'Every property is personally verified by our team to ensure authenticity and quality.',
                color: 'secondary',
                delay: '0.1s'
              },
              {
                icon: Shield,
                title: 'Secure Transactions',
                description: 'Your data and transactions are protected with enterprise-grade security protocols.',
                color: 'accent',
                delay: '0.2s'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${feature.color} to-${feature.color}/70 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-6 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="container relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
              Ready to Find Your
              <span className="block mt-2">Perfect Home?</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Join thousands of happy homeowners who found their dream property with TUMHARAGHAR
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-10 py-7 bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-105 font-semibold rounded-2xl">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Create Free Account
                </Button>
              </Link>
              <Link to="/properties">
                <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 font-semibold rounded-2xl">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">TUMHARAGHAR</span>
                <p className="text-white/60 text-sm">Your Dream Home Awaits</p>
              </div>
            </div>
            
            <div className="flex gap-8 text-white/70">
              <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
              <Link to="/auth" className="hover:text-primary transition-colors">Sign In</Link>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50">
            <p>&copy; 2024 TUMHARAGHAR. All rights reserved. Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MapPin(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
