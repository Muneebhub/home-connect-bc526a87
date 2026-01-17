import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Home className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TUMHARAGHAR
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/properties">
            <Button variant="ghost">Browse Properties</Button>
          </Link>
          
          {user ? (
            <>
              <Link to={userRole === 'seller' ? '/seller-dashboard' : '/buyer-dashboard'}>
                <Button variant="ghost" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}