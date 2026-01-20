import { motion } from "framer-motion";
import { FolderKanban, Sparkles, TrendingUp, Users } from "lucide-react";
import Layout from "@/components/Layout";
import GeminiTerminal from "@/components/GeminiTerminal";
import FileUploadZone from "@/components/FileUploadZone";
import StatsCard from "@/components/StatsCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm text-primary font-medium">AI-Powered Analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Stop logging.
            <span className="text-primary text-glow"> Start proving.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your SIWES project videos and photos into professional portfolios with AI-powered analysis and documentation.
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your SIWES project media and let Gemini AI analyze, document, and extract professional insights automatically.
          </p>
        </motion.div>

        {/* Quick Start Carousel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 text-center">Quick Start</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <Card className="card-glass border-primary/30">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">Video Preview</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Shaky Video → $100k Portfolio</h3>
                    <p className="text-sm text-muted-foreground">See how Gemini transforms raw footage into professional case studies.</p>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="card-glass border-primary/30">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">Photo Gallery</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Photo Batch → Skill Showcase</h3>
                    <p className="text-sm text-muted-foreground">Upload multiple photos and get comprehensive technical analysis.</p>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="card-glass border-primary/30">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">Case Study</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">AI-Generated Case Study</h3>
                    <p className="text-sm text-muted-foreground">Watch the thought process as Gemini builds your professional narrative.</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatsCard title="Total Projects" value={12} subtitle="4 pending analysis" icon={FolderKanban} delay={0.1} />
          <StatsCard title="Skills Extracted" value={24} trend={{ value: 15, isPositive: true }} icon={Sparkles} delay={0.2} />
          <StatsCard title="Profile Views" value="1.2k" trend={{ value: 8, isPositive: true }} icon={TrendingUp} delay={0.3} />
          <StatsCard title="Recruiter Queries" value={47} subtitle="This month" icon={Users} delay={0.4} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Upload Project Media</h2>
            </div>
            <FileUploadZone />
          </motion.div>

          {/* Gemini Terminal */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-terminal-green" style={{ boxShadow: "0 0 15px hsl(142 71% 45% / 0.5)" }} />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Gemini Thought Terminal</h2>
            </div>
            <GeminiTerminal />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="card-glass text-left hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-all">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View All Projects</h3>
                  <p className="text-sm text-muted-foreground">Browse your portfolio</p>
                </div>
              </div>
            </button>

            <button className="card-glass text-left hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-all">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Skill Analysis</h3>
                  <p className="text-sm text-muted-foreground">View your skill tree</p>
                </div>
              </div>
            </button>

            <button className="card-glass text-left hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-all">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Share Portfolio</h3>
                  <p className="text-sm text-muted-foreground">Get your public link</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
