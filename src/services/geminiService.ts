import { supabase } from "@/integrations/supabase/client";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Initialize with v1alpha to access Gemini 3's "Thinking" and "Media Resolution" features
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: API_KEY,
  httpOptions: { apiVersion: "v1alpha" },
});

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
 * Robustly extracts JSON from a model response that might contain markdown formatting.
 */
const extractJsonFromResponse = (text: string): ProjectAnalysis => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("The AI response did not contain a valid JSON object.");
  return JSON.parse(jsonMatch[0]);
};

/**
 * The main generator that handles storage, streaming thoughts, and DB insertion.
 */
export const generateProjectProof = async (
  files: File[],
  onThought: (thought: Thought) => void,
): Promise<{ success: boolean; projectId: string }> => {
  if (files.length === 0) throw new Error("Please upload a file to begin the audit.");
  const file = files[0];

  try {
    // 1. Storage Phase
    onThought({ text: "Uploading media to SmartSIWES vault...", type: "process" });
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("project-media").upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-media").getPublicUrl(filePath);

    onThought({ text: "Media synchronized with cloud storage.", type: "success" });

    // 2. Multimodal "Deep Thinking" Phase
    onThought({ text: "Initializing Senior Engineer reasoning modules...", type: "info" });

    const base64Data = await fileToBase64(file);
    const model = "gemini-3-pro-preview";

    const result = await ai.models.generateContentStream({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            {
              text: "Act as a Senior Technical Auditor. Analyze this SIWES project. Output a JSON object with: title, summary (300 words), description, skills[], technical_specs{}, category, and recruiter_insight. Perform a deep reasoning audit of all visible components.",
            },
          ],
        },
      ],
      config: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: ThinkingLevel.HIGH, // Use the Enum reference directly
        },
      },
    });

    let fullResponseText = "";

    // 3. Real-time Thought Streaming
    // This loops through chunks and pushes "part.thought" to your UI terminal
    for await (const chunk of result.stream) {
      const parts = chunk.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if ("thought" in part && part.thought) {
          // Send ACTUAL AI internal thoughts to the terminal component
          onThought({ text: part.text, type: "process" });
        } else if (part.text) {
          fullResponseText += part.text;
        }
      }
    }

    onThought({ text: "Deep technical rationale synthesized.", type: "success" });

    // 4. Persistence Phase
    const analysis: ProjectAnalysis = extractJsonFromResponse(fullResponseText);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Session expired. Please sign in again.");

    const { data: project, error: dbError } = await supabase
      .from("projects")
      .insert({
        user_id: userData.user.id,
        title: analysis.title || "Project Audit",
        description: analysis.description,
        summary: analysis.summary,
        thumbnail: publicUrl,
        category: analysis.category,
        is_video: file.type.startsWith("video/"),
        skills: analysis.skills,
        technical_specs: analysis.technical_specs,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    onThought({ text: "Smart portfolio generated successfully.", type: "success" });
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Critical Analysis Error:", error);
    onThought({ text: `Audit failed: ${error instanceof Error ? error.message : "Internal engine error"}`, type: "warning" });
    return { success: false, projectId: "" };
  }
};

/**
 * Helper to convert browser File objects to API-ready Base64 strings.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
};
