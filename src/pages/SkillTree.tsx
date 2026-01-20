import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SkillRadarChart from "@/components/SkillRadarChart";

const SkillTree = () => {
  const { user } = useAuth();

  // FIX: Fetch real projects to aggregate actual skills
  const { data: categories, isLoading } = useQuery({
    queryKey: ["skillCategories", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: projects, error } = await supabase.from("projects").select("skills, category").eq("user_id", user.id);

      if (error) throw error;

      // Logic to aggregate skills into categories
      const aggregation: Record<string, { projects: number; skills: Set<string> }> = {};

      projects.forEach((p) => {
        const cat = p.category || "General Engineering";
        if (!aggregation[cat]) {
          aggregation[cat] = { projects: 0, skills: new Set() };
        }
        aggregation[cat].projects += 1;
        if (Array.isArray(p.skills)) {
          p.skills.forEach((s: string) => aggregation[cat].skills.add(s));
        }
      });

      return Object.entries(aggregation).map(([name, data]) => ({
        name,
        level: Math.min(60 + data.projects * 5 + data.skills.size * 2, 98), // Weighted proficiency
        projects: data.projects,
        skills: Array.from(data.skills),
        color: "primary",
      }));
    },
    enabled: !!user,
  });

  // Calculate real stats for the stats bar
  const totalSkills = categories?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0;
  const avgProficiency = categories?.length ? Math.round(categories.reduce((acc, cat) => acc + cat.level, 0) / categories.length) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Skill
            <span className="text-primary text-glow"> Tree</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-extracted skills from your SIWES projects, visualized as an interactive competency map.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Bar - Now dynamic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            >
              <div className="card-glass flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{totalSkills}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Skills</p>
                </div>
              </div>

              <div className="card-glass flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{categories?.length || 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Skill Categories</p>
                </div>
              </div>

              <div className="card-glass flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{avgProficiency}%</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Average Proficiency</p>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
                  <h2 className="text-lg md:text-xl font-semibold text-foreground">Competency Radar</h2>
                </div>
                {/* Ensure SkillRadarChart can handle the dynamic data if updated */}
                <SkillRadarChart />
              </motion.div>

              {/* Skill Categories Breakdown - Now dynamic */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
                  <h2 className="text-lg md:text-xl font-semibold text-foreground">Skill Breakdown</h2>
                </div>

                {categories?.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="card-glass"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-foreground">{category.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {category.projects} project{category.projects !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="text-xl md:text-2xl font-bold text-primary">{category.level}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.level}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-primary glow-primary"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {!categories?.length && (
                  <div className="text-center py-12 card-glass text-muted-foreground">No projects analyzed yet. Go to the Studio to begin.</div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SkillTree;
