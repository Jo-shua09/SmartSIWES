import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Globe, Bell, Shield, Save, Eye, EyeOff, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const publicUrl = "https://Smart-SIWES.app/portfolio/johndoe";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Configure your Smart-SIWES portfolio and API integrations.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground">Profile Settings</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full input-glass" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input type="email" defaultValue="john.doe@university.edu" className="w-full input-glass" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Institution</label>
                <input type="text" defaultValue="University of Technology" className="w-full input-glass" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">SIWES Duration</label>
                <input type="text" defaultValue="6 months" className="w-full input-glass" />
              </div>
            </div>
          </motion.div>

          {/* API Configuration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground">API Configuration</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Configure your Gemini API key for AI features</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full input-glass pr-20"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Public Portfolio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground">Public Portfolio</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Share your portfolio with employers</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Make Portfolio Public</p>
                  <p className="text-sm text-muted-foreground">Allow anyone with the link to view your portfolio</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {isPublic && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Your public URL:</p>
                  <div className="flex items-center gap-2">
                    <input type="text" value={publicUrl} readOnly className="flex-1 input-glass text-sm" />
                    <button
                      onClick={() => copyToClipboard(publicUrl)}
                      className="p-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-glass">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive emails when recruiters view your portfolio</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-4 border-primary/30"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Security Note</p>
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally in your browser and is never sent to our servers. For production use, consider using environment
                  variables for enhanced security.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-end">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              {saved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
