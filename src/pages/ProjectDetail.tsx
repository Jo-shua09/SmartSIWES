import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, FileText, Wrench, Lightbulb, Share2, Download, Play, ExternalLink, Loader2, Globe, Lock } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import ChatBubble from "@/components/ChatBubble";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <button onClick={() => navigate("/projects")} className="text-primary hover:underline">
            Back to Projects
          </button>
        </div>
      </Layout>
    );
  }

  // Parse JSON fields safely
  const specs = typeof project.technical_specs === "object" && project.technical_specs !== null ? project.technical_specs : {};
  const methodology = Array.isArray(project.methodology) ? project.methodology : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
              {project.category || "Uncategorized"}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">{project.title}</h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">{project.description || "No description available."}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={handleShareProject} className="btn-primary flex items-center gap-2">
              {project.is_public ? <Globe className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {project.is_public ? "Public Link" : "Share Project"}
            </button>
            <button className="btn-ghost flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* Visual Proof Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Visual Proof</h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden glass">
            <img src={project.thumbnail || "/placeholder.svg"} alt={project.title} className="w-full aspect-video object-cover" />
            {project.is_video && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-primary glow-accent flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI-Generated Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Technical Specifications */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">Technical Specifications</h3>
                <p className="text-xs md:text-sm text-muted-foreground">AI-extracted details</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground capitalize w-32 flex-shrink-0">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="text-sm text-foreground">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Methodology */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">Methodology</h3>
                <p className="text-xs md:text-sm text-muted-foreground">AI-analyzed process</p>
              </div>
            </div>

            <ol className="space-y-3">
              {methodology.map((step: string, index: number) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Professional Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-glass mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">Professional Summary</h3>
              <p className="text-xs md:text-sm text-muted-foreground">AI-generated overview</p>
            </div>
          </div>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{project.summary || "No summary available."}</p>
        </motion.div>

        {/* Skills Tags */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Extracted Skills</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(project.skills || []).map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-lg glass text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chat Bubble */}
      <ChatBubble projectTitle={project.title} />
    </Layout>
  );
};

export default ProjectDetail;
