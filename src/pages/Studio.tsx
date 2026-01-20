import { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Sparkles, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import GeminiTerminal from "@/components/GeminiTerminal";
import FileUploadZone, { UploadedFile } from "@/components/FileUploadZone";
import StatsCard from "@/components/StatsCard";
import { generateProjectProof, Thought } from "@/services/geminiService";

const Studio = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const navigate = useNavigate();

  const handleGenerateProof = async () => {
    setShowTerminal(true);
    setIsAnalyzing(true);
    setThoughts([]);
    // Extract raw File objects from the UploadedFile wrapper
    const rawFiles = files.map((f) => f.file);
    const result = await generateProjectProof(rawFiles, (thought: Thought) => {
      setThoughts((prev) => [...prev, thought]);
    });
    if (result.success) {
      navigate(`/project/${result.projectId}`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm text-primary font-medium">AI-Powered Analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Project
            <span className="text-primary text-glow"> Studio</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your SIWES project media and let Gemini AI analyze, document, and extract professional insights automatically.
          </p>
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
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Upload Project Media</h2>
            </div>
            <div className="flex-1">
              <FileUploadZone onFilesUploaded={(uploaded) => setFiles(uploaded)} />
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateProof}
              disabled={files.length === 0 || isAnalyzing}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all ${
                files.length > 0
                  ? "bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Generating Proof...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Proof
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Gemini Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`transition-all duration-500 ${showTerminal ? "opacity-100" : "opacity-50 blur-sm grayscale"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-terminal-green" style={{ boxShadow: "0 0 15px hsl(142 71% 45% / 0.5)" }} />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Gemini Thought Terminal</h2>
            </div>
            <GeminiTerminal isActive={showTerminal} thoughts={thoughts} />

            {!showTerminal && (
              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-white/5 text-center text-muted-foreground text-sm">
                <p>Terminal will activate when analysis begins.</p>
              </div>
            )}
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

export default Studio;
