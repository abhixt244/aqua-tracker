import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Droplets, BarChart3, Lightbulb, TrendingDown, ArrowRight, Waves } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: Droplets,
      title: 'Track Usage',
      description: 'Log your daily water consumption by category - showers, cooking, cleaning, and more.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Beautiful charts showing your usage trends, patterns, and category breakdowns.',
    },
    {
      icon: Lightbulb,
      title: 'Smart Tips',
      description: 'Get personalized water-saving recommendations based on your habits.',
    },
    {
      icon: TrendingDown,
      title: 'Track Progress',
      description: 'Monitor your conservation efforts with weekly comparisons and goals.',
    },
  ];

  return (
    <MainLayout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 water-gradient opacity-10 blur-3xl rounded-full animate-pulse-water" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary opacity-10 blur-3xl rounded-full animate-pulse-water" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative text-center max-w-4xl mx-auto px-4">
            {/* Logo Animation */}
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 water-gradient blur-2xl opacity-40 animate-pulse-water" />
                <div className="relative p-6 rounded-3xl water-gradient shadow-water-lg">
                  <Droplets className="h-16 w-16 text-primary-foreground animate-float" />
                </div>
              </div>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="water-gradient-text">AquaWise</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Smart Water Usage Tracking
            </p>
            
            <p className="text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto">
              Monitor your water consumption, discover patterns, and get personalized tips to conserve water and save money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="water-gradient shadow-water hover:shadow-water-lg transition-all text-lg px-8 h-14 group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="water-gradient shadow-water hover:shadow-water-lg transition-all text-lg px-8 h-14 group">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Wave Animation */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            <svg className="absolute bottom-0 w-[200%] h-24 animate-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path 
                fill="hsl(var(--primary) / 0.1)" 
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="water-gradient-text"> Save Water</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to help you understand and reduce your water footprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-water transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 p-3 rounded-xl w-fit water-gradient shadow-water group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="relative rounded-3xl overflow-hidden water-gradient p-12 text-center">
            <div className="absolute inset-0 opacity-30">
              <Waves className="absolute top-4 left-4 h-32 w-32 text-primary-foreground/20" />
              <Waves className="absolute bottom-4 right-4 h-24 w-24 text-primary-foreground/20 rotate-180" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Make Every Drop Count?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who are already tracking their water usage and making a difference.
              </p>
              {!user && (
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 h-14 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Start Tracking Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
