import { motion } from "framer-motion";
import { Zap, Target, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import SkillRadarChart from "@/components/SkillRadarChart";

const skillCategories = [
  {
    name: "Embedded Systems",
    level: 85,
    projects: 5,
    color: "primary",
    skills: ["ESP32", "Arduino", "STM32", "Raspberry Pi", "FPGA"],
  },
  {
    name: "PCB Design",
    level: 72,
    projects: 3,
    color: "primary",
    skills: ["Altium Designer", "KiCad", "Eagle", "Schematic Capture"],
  },
  {
    name: "Programming",
    level: 88,
    projects: 8,
    color: "primary",
    skills: ["C/C++", "Python", "JavaScript", "Rust", "Assembly"],
  },
  {
    name: "IoT Development",
    level: 82,
    projects: 4,
    color: "primary",
    skills: ["MQTT", "LoRa", "Zigbee", "BLE", "WiFi"],
  },
  {
    name: "Power Electronics",
    level: 70,
    projects: 2,
    color: "primary",
    skills: ["SMPS Design", "Motor Drives", "Battery Systems", "Solar"],
  },
  {
    name: "CAD Modeling",
    level: 65,
    projects: 3,
    color: "primary",
    skills: ["SolidWorks", "Fusion 360", "AutoCAD", "3D Printing"],
  },
];

const SkillTree = () => {
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

        {/* Stats Bar */}
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
              <p className="text-xl md:text-2xl font-bold text-foreground">24</p>
              <p className="text-xs md:text-sm text-muted-foreground">Total Skills</p>
            </div>
          </div>

          <div className="card-glass flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">6</p>
              <p className="text-xs md:text-sm text-muted-foreground">Skill Categories</p>
            </div>
          </div>

          <div className="card-glass flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">78%</p>
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
            <SkillRadarChart />
          </motion.div>

          {/* Skill Categories */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-primary glow-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Skill Breakdown</h2>
            </div>

            {skillCategories.map((category, index) => (
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

                {/* Progress Bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.level}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-primary glow-primary"
                  />
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SkillTree;
