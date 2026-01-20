import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Zap } from "lucide-react";

interface TerminalLine {
  id: number;
  text: string;
  type: "info" | "process" | "success" | "warning";
}

const terminalMessages = [
  { text: "Initializing Gemini AI analysis engine...", type: "info" as const },
  { text: "Loading multimodal perception modules...", type: "process" as const },
  { text: "Scanning uploaded media for technical artifacts...", type: "process" as const },
  { text: "Identifying circuit components via visual grounding...", type: "process" as const },
  { text: "Detected: ESP32-WROOM-32, DHT22 Sensor...", type: "success" as const },
  { text: "Cross-referencing ESP32 wiring with standard IoT protocols...", type: "process" as const },
  { text: "Mapping signal flow and power distribution...", type: "process" as const },
  { text: "Synthesizing technical rationale for power efficiency...", type: "process" as const },
  { text: "Evaluating design patterns against industry standards...", type: "info" as const },
  { text: "Generating professional documentation...", type: "success" as const },
  { text: "Skill extraction: Embedded Systems → Level 4", type: "success" as const },
  { text: "Skill extraction: PCB Design → Level 3", type: "success" as const },
  { text: "Analysis complete. Documentation ready.", type: "success" as const },
];

interface Thought {
  text: string;
  type: "info" | "process" | "success" | "warning";
}

interface GeminiTerminalProps {
  isActive?: boolean;
  compact?: boolean;
  thoughts?: Thought[];
}

const GeminiTerminal = ({ isActive = true, compact = false, thoughts }: GeminiTerminalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    // If thoughts are provided, use them instead of hardcoded messages
    if (thoughts && thoughts.length > 0) {
      setLines(
        thoughts.map((thought, index) => ({
          id: Date.now() + index,
          text: thought.text,
          type: thought.type,
        })),
      );
      return;
    }

    // Fallback to hardcoded messages if no thoughts provided
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % terminalMessages.length;
        const message = terminalMessages[nextIndex];

        setLines((prevLines) => {
          const newLines = [...prevLines, { id: Date.now(), text: message.text, type: message.type }].slice(-15);
          return newLines;
        });

        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, thoughts]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "text-primary";
      case "warning":
        return "text-yellow-400";
      case "process":
        return "text-glow-secondary";
      default:
        return "text-terminal-green";
    }
  };

  return (
    <div className={`glass rounded-xl overflow-hidden ${compact ? "h-48" : "h-64 md:h-80"}`}>
      {/* Terminal Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-terminal-bg border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Terminal className="w-4 h-4" />
          <span className="font-mono">gemini_thought_terminal</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary animate-pulse-glow" />
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={scrollRef} className="h-full bg-terminal-bg p-4 overflow-y-auto scrollbar-thin font-mono text-xs md:text-sm">
        {lines.map((line, index) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 mb-2 ${getLineColor(line.type)}`}
          >
            <span className="text-muted-foreground select-none">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-primary">›</span>
            <span className="terminal-text">{line.text}</span>
          </motion.div>
        ))}

        {/* Blinking Cursor */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground select-none">[{new Date().toLocaleTimeString()}]</span>
          <span className="text-primary">›</span>
          <span className="w-2 h-5 bg-terminal-green animate-terminal-blink" />
        </div>
      </div>
    </div>
  );
};

export default GeminiTerminal;
