import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, title, location, bio")
        .eq("id", user!.id)
        .single<{ full_name: string; title: string; location: string; bio: string }>();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setName(data.full_name || "");
        setTitle(data.title || "");
        setLocation(data.location || "");
        setBio(data.bio || "");
      } else if (user?.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    } catch (error) {
      console.error("Error loading user data!", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        id: user!.id,
        full_name: name,
        title,
        location,
        bio,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your account information</p>
          </div>

          <Card className="card-glass border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Profile Information</CardTitle>
              <CardDescription className="text-sm md:text-base">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-16 h-16 md:w-20 md:h-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user?.email} />
                  <AvatarFallback className="text-base md:text-lg">
                    {(user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{user?.user_metadata?.full_name || "User"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g. Computer Engineering Student"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" type="text" placeholder="e.g. Lagos, Nigeria" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" type="text" placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={user?.email || ""} required disabled />
                  <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
