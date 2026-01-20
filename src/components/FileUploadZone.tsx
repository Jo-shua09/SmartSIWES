import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Film, Image, X, CheckCircle2, Loader2, ZoomIn, ToggleLeft, ToggleRight } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  type: "video" | "image";
  size: string;
  status: "uploading" | "analyzing" | "complete";
  preview?: string;
  file: File;
}

interface FileUploadZoneProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

const FileUploadZone = ({ onFilesUploaded }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   // Convert file to Base64 for the inlineData API call
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = async () => {
  //     const base64Data = (reader.result as string).split(",")[1];

  //     // Call the service
  //     const report = await generateProjectReport(base64Data, file.type);

  //     // Save to Supabase or display in UI
  //     console.log("Generated Report:", report);
  //   };
  // };

  const processFile = (file: File): UploadedFile => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: isVideo ? "video" : "image",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: "uploading",
      preview: isImage ? URL.createObjectURL(file) : undefined,
      file: file,
    };
  };

  const simulateUpload = (fileId: string) => {
    setTimeout(() => {
      setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "analyzing" as const } : f)));

      setTimeout(() => {
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "complete" as const } : f)));
      }, 2000);
    }, 1500);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((f) => f.type.startsWith("video/") || f.type.startsWith("image/"));

      const newUploadedFiles = validFiles.map(processFile);

      setUploadedFiles((prev) => {
        const updated = [...prev, ...newUploadedFiles];
        if (onFilesUploaded) onFilesUploaded(updated);
        return updated;
      });

      newUploadedFiles.forEach((file) => {
        simulateUpload(file.id);
      });
    },
    [onFilesUploaded],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploadedFiles = files.map(processFile);

    setUploadedFiles((prev) => {
      const updated = [...prev, ...newUploadedFiles];
      if (onFilesUploaded) onFilesUploaded(updated);
      return updated;
    });

    newUploadedFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (onFilesUploaded) onFilesUploaded(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "hsl(160 84% 39%)" : "hsl(222 30% 18%)",
        }}
        className={`relative rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
          isDragging ? "bg-primary/10 glow-primary" : "bg-surface-glass/30 hover:bg-surface-glass/50"
        }`}
      >
        <input
          type="file"
          accept="video/*,image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <motion.div animate={{ y: isDragging ? -5 : 0 }} className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">Drop your project media here</h3>
            <p className="text-muted-foreground text-xs md:text-sm">Support for MP4 videos and JPEG/PNG images</p>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>MP4, MOV, WebM</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>JPEG, PNG, WebP</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-xl p-4 flex items-center gap-4"
              >
                {/* Preview */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <Film className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.size}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <>
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </>
                  )}
                  {file.status === "analyzing" && (
                    <>
                      <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                      <span className="text-sm text-yellow-400">Analyzing...</span>
                    </>
                  )}
                  {file.status === "complete" && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm text-primary">Complete</span>
                    </>
                  )}
                </div>

                {/* Remove Button */}
                <button onClick={() => removeFile(file.id)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
