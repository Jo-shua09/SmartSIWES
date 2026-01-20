import { motion } from "framer-motion";
import { ExternalLink, Download, Share2, Eye, Calendar, MapPin, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SkillRadarChart from "@/components/SkillRadarChart";
import ProjectCard from "@/components/ProjectCard";
import StatsCard from "@/components/StatsCard";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicProfile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      // 1. Fetch Profile and Projects (Filtered by is_public if viewing someone else)
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", targetUserId).single();

      let query = supabase.from("projects").select("*").eq("user_id", targetUserId);
      if (userId) query = query.eq("is_public", true); // Only public if viewing someone else

      const { data: projectsData } = await query.order("created_at", { ascending: false });

      // 2. Extract Real Skills and Recruit Insight from latest project
      const skillsMap = new Map<string, number>();
      projectsData?.forEach((p) => {
        if (Array.isArray(p.skills)) {
          p.skills.forEach((s: string) => skillsMap.set(s, skillsMap.get(s) || 85));
        }
      });

      return {
        ...profileData,
        full_name: profileData?.full_name || user?.user_metadata?.full_name || "Student",
        projects: projectsData || [],
        skills: Array.from(skillsMap.entries()).map(([name, level]) => ({ name, level })),
        // Use the insight from the most recent project analysis
        insight: projectsData?.[0]?.recruiter_insight || "Project analysis pending...",
      };
    },
    enabled: !!targetUserId,
  });

  if (isLoading)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 mx-4"
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <span className="text-xs md:text-sm text-primary font-medium">Verified Portfolio</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{profile?.full_name}</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-4">{profile?.title || "Engineering Student"}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile?.location || "Lagos, Nigeria"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>SIWES 2024</span>
                  </div>
                </div>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8">
                  {profile?.bio || "Showcasing technical excellence through AI-verified projects."}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button className="btn-primary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <StatsCard title="Projects" value={profile?.projects.length || 0} subtitle="Verified" icon={Eye} />
                <StatsCard title="Skills" value={profile?.skills.length || 0} subtitle="AI-Identified" icon={Share2} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Technical Skills</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <SkillRadarChart />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="py-16 bg-muted/30 mx-4">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {profile?.projects.map((project: any, index: number) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
                  <ProjectCard
                    id={project.id}
                    title={project.title}
                    description={project.description || ""}
                    thumbnail={project.thumbnail || "/placeholder.svg"}
                    category={project.category || "Project"}
                    date={new Date(project.created_at).toLocaleDateString()}
                    skills={project.skills || []}
                    isVideo={project.is_video || false}
                    onClick={() => navigate(`/project/${project.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="card-glass border-primary/30 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">Recruiter's Insight</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">AI Technical Audit</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground whitespace-pre-wrap">
                  {/* REAL AI INSIGHT FROM DATABASE */}
                  {profile?.insight}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PublicProfile;
