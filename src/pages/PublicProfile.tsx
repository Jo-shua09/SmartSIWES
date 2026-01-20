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

  // Determine which ID to use: URL param or current user
  const targetUserId = userId || user?.id;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicProfile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      // 1. Fetch Profile Data
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", targetUserId).single();

      if (profileError) {
        // If profile doesn't exist yet, return basic info if it's the current user
        if (targetUserId === user?.id) {
          return {
            full_name: user?.user_metadata?.full_name || "Student",
            title: "Student",
            location: "Unknown",
            bio: "Profile not yet set up.",
            projects: [],
            skills: [],
          };
        }
        throw profileError;
      }

      // 2. Fetch Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      // 3. Fetch Skills (Mocked for now if no table, or fetch from 'skills' table)
      // For this implementation, we'll extract unique skills from projects if no explicit skills table
      const extractedSkills = new Set<string>();
      projectsData?.forEach((p) => {
        if (Array.isArray(p.skills)) {
          p.skills.forEach((s: string) => extractedSkills.add(s));
        }
      });

      const skillsList = Array.from(extractedSkills)
        .map((name) => ({
          name,
          level: Math.floor(Math.random() * 30) + 70, // Mock level for visualization
        }))
        .slice(0, 6);

      return {
        ...profileData,
        projects: projectsData || [],
        skills: skillsList,
      };
    },
    enabled: !!targetUserId,
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

  if (error || !profile) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">The user profile you are looking for does not exist or is private.</p>
        </div>
      </Layout>
    );
  }

  // Calculate stats based on real data
  const stats = {
    totalProjects: profile.projects.length,
    skillsVerified: profile.skills.length,
    profileViews: 156, // Placeholder: requires analytics table
    recruiterContacts: 8, // Placeholder
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 mx-4"
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <span className="text-xs md:text-sm text-primary font-medium">Verified Portfolio</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{profile.full_name || "Anonymous User"}</h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-4">{profile.title || "Student"}</p>

                <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm md:text-base">{profile.location || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm md:text-base">SIWES 2024</span>
                  </div>
                </div>

                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8">{profile.bio || "No bio available."}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button className="btn-primary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                  <button className="btn-ghost flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </button>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <StatsCard title="Projects" value={stats.totalProjects} subtitle="Completed" icon={Eye} />
                <StatsCard title="Skills" value={stats.skillsVerified} subtitle="AI-Verified" icon={Share2} />
                <StatsCard title="Profile Views" value={stats.profileViews} subtitle="This month" icon={Eye} />
                <StatsCard title="Recruiter Interest" value={stats.recruiterContacts} subtitle="Contacts" icon={ExternalLink} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Technical Skills</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                AI-verified competencies demonstrated through SIWES projects
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <SkillRadarChart />
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="py-16 bg-muted/30 mx-4">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Featured Projects</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-world implementations with detailed technical documentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {profile.projects.map((project: any, index: number) => (
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
              {profile.projects.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">No projects found for this user.</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recruiter's Insight */}
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
                    <p className="text-xs md:text-sm text-muted-foreground">AI Analysis Summary</p>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Technical Proficiency:</strong> Demonstrates strong practical skills in embedded systems and
                    IoT development, with hands-on experience in circuit design and microcontroller programming.
                  </p>
                  <p>
                    <strong className="text-foreground">Project Quality:</strong> Projects show good understanding of system integration and
                    problem-solving, with clear documentation and testing methodologies.
                  </p>
                  <p>
                    <strong className="text-foreground">Growth Potential:</strong> Ready for junior developer roles in IoT and embedded systems, with
                    potential for rapid advancement in full-stack development.
                  </p>
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
