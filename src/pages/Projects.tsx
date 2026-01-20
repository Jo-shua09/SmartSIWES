import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["myProjects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredProjects = (projects || []).filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.skills || []).some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Project Gallery</h1>
          <p className="text-sm md:text-base text-muted-foreground">Explore your SIWES projects with AI-generated documentation and insights.</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, skills, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-glass pl-12"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="btn-ghost flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${viewMode === "grid" ? "bg-primary/20 text-primary" : "hover:bg-white/5 text-muted-foreground"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-colors ${viewMode === "list" ? "bg-primary/20 text-primary" : "hover:bg-white/5 text-muted-foreground"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}
          >
            {filteredProjects.map((project: any, index: number) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description || ""}
                  thumbnail={project.thumbnail || "/placeholder.svg"}
                  category={project.category || "Uncategorized"}
                  date={new Date(project.created_at).toLocaleDateString()}
                  skills={project.skills || []}
                  isVideo={project.is_video || false}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
