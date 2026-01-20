import { motion } from "framer-motion";
import { Play, Eye, Calendar, Tag, ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  date: string;
  skills: string[];
  isVideo?: boolean;
  onClick?: () => void;
}

const ProjectCard = ({ title, description, thumbnail, category, date, skills, isVideo = false, onClick }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group card-glass cursor-pointer overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play Button for Videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center glow-accent">
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            </motion.div>
          </div>
        )}

        {/* View Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">{category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{title}</h3>

        <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>View Case Study</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
              {skill}
            </span>
          ))}
          {skills.length > 3 && <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">+{skills.length - 3}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
