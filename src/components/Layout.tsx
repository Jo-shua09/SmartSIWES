import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FolderKanban, GitBranch, Settings, Menu, X, Sparkles, ExternalLink, User, Palette, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/studio", label: "Studio", icon: Palette },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/skills", label: "Skill Tree", icon: GitBranch },
  { path: "/public-profile", label: "Public Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background gradient-radial overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="container mx-auto px-8 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
              <div>
                {/* <span className="text-lg md:text-xl font-bold text-foreground">Smart</span>
                <span className="text-lg md:text-xl font-bold text-primary text-glow">-SIWES</span> */}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? "bg-primary/20 text-primary border-glow" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative group">
                  <Link to="/profile">
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>{(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/signin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed overflow-hidden inset-0 z-40 lg:hidden glass-strong"
          >
            <div className="flex flex-col h-full justify-between w-full">
              {/* Header */}
              <div className="flex items-center justify-between  border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-8 mt-10 flex flex-col h-full justify-between">
                <div className="">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-4 w-full max-w-sm transition-all duration-300 ${
                          isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-medium text-lg">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Auth Section */}
                <div className="border-t border-white/10 mb-8 pb-2 w-full max-w-sm">
                  {user ? (
                    <div className=" py-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                      >
                        <User className="w-6 h-6" />
                        <span className="font-medium text-lg">Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                      >
                        <LogOut className="w-6 h-6" />
                        <span className="font-medium text-lg">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-6 py-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                    >
                      <LogIn className="w-6 h-6" />
                      <span className="font-medium text-lg">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 min-h-screen px-4 md:px-8">{children}</main>
    </div>
  );
};

export default Layout;
