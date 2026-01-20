import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/components/client";

// Secure your key using environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface Thought {
  text: string;
  type: "info" | "process" | "success" | "warning";
}

export interface ProjectAnalysis {
  title: string;
  summary: string;
  description: string;
  skills: string[];
  technical_specs: Record<string, string | number>;
  category: string;
  recruiter_insight: string;
}

/**
 * Processes student project media and generates a technical report.
 * @param fileData - The base64 string of the image or video
 * @param mimeType - e.g., 'image/jpeg' or 'video/mp4'
 */
export const generateProjectReport = async (fileData: string, mimeType: string): Promise<ProjectAnalysis> => {
  const model = "gemini-3-pro-preview"; // The flagship reasoning model

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType,
              },
            },
            { text: "Please generate the comprehensive technical report for my portfolio based on this media." },
          ],
        },
      ],
      config: {
        // The System Instruction primes the model's "identity" and expertise
        systemInstruction:
          "You are an expert Senior Engineer and Technical Recruiter. Analyze this video/image of a student's SIWES project. Identify all hardware/software components. Return a JSON object with the following fields: 'title' (a professional project title), 'summary' (300-word summary), 'description' (short description for a card), 'skills' (array of strings), 'technical_specs' (key-value object of specs), 'category' (e.g. Embedded Systems, IoT, Web Dev), and 'recruiter_insight' (string). Do not use markdown formatting.",
        temperature: 0.7,
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: "HIGH" as any,
        },
      },
    });

    const text = response.text();
    // Clean markdown code blocks if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate report. Please check your API key and file format.");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateProjectProof = async (
  files: File[],
  onThought: (thought: Thought) => void,
): Promise<{ success: boolean; projectId: string }> => {
  if (files.length === 0) throw new Error("No files provided");
  const file = files[0]; // Handle first file for now

  try {
    // 1. Upload to Supabase Storage
    onThought({ text: "Uploading media to secure storage...", type: "process" });
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from("project-media").upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-media").getPublicUrl(filePath);

    onThought({ text: "Media uploaded successfully.", type: "success" });

    // 2. Analyze with Gemini
    onThought({ text: "Initializing multimodal perception modules...", type: "info" });
    const base64Data = await fileToBase64(file);

    // Stream the specific thought signatures as requested
    onThought({ text: "Detecting breadboard components...", type: "process" });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onThought({ text: "Analyzing logic flow...", type: "process" });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onThought({ text: "Generating SIWES logbook entry...", type: "process" });

    const analysis = await generateProjectReport(base64Data, file.type);
    onThought({ text: "Technical rationale synthesized.", type: "success" });

    // 3. Save to Database
    onThought({ text: "Drafting professional case study...", type: "process" });

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: project, error: dbError } = await supabase
      .from("projects")
      .insert({
        user_id: userData.user.id as string,
        title: analysis.title || "New Project Analysis",
        description: analysis.description || "AI Analyzed Project",
        summary: analysis.summary,
        thumbnail: publicUrl,
        category: analysis.category || "Engineering",
        is_video: file.type.startsWith("video/"),
        skills: analysis.skills || [],
        technical_specs: analysis.technical_specs || {},
      })
      .select()
      .single();

    if (dbError) throw dbError;

    onThought({ text: "Proof generation complete.", type: "success" });
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error(error);
    onThought({ text: "Analysis failed.", type: "warning" });
    return { success: false, projectId: "" };
  }
};
