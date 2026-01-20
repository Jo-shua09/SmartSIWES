import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface SkillData {
  skill: string;
  level: number;
  fullMark: number;
}

const skillsData: SkillData[] = [
  { skill: "Embedded Systems", level: 85, fullMark: 100 },
  { skill: "PCB Design", level: 72, fullMark: 100 },
  { skill: "Microcontrollers", level: 90, fullMark: 100 },
  { skill: "Circuit Analysis", level: 78, fullMark: 100 },
  { skill: "Programming", level: 88, fullMark: 100 },
  { skill: "CAD Modeling", level: 65, fullMark: 100 },
  { skill: "Power Systems", level: 70, fullMark: 100 },
  { skill: "IoT Development", level: 82, fullMark: 100 },
];

const SkillRadarChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-[400px] md:h-[500px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
          <PolarGrid 
            stroke="hsl(222 30% 25%)" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ 
              fill: "hsl(215 20% 65%)", 
              fontSize: 11,
              fontFamily: "Inter"
            }}
            tickLine={{ stroke: "hsl(222 30% 25%)" }}
          />
          <PolarRadiusAxis
            angle={22.5}
            domain={[0, 100]}
            tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }}
            tickCount={5}
            axisLine={{ stroke: "hsl(222 30% 25%)" }}
          />
          <Radar
            name="Skills"
            dataKey="level"
            stroke="hsl(160 84% 39%)"
            fill="hsl(160 84% 39%)"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "hsl(160 84% 39%)",
              stroke: "hsl(160 84% 50%)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "hsl(160 84% 50%)",
              stroke: "hsl(160 84% 60%)",
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillRadarChart;
