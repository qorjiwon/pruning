import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DropZoneProps {
  onFileDrop: (file: File) => void;
}

const DropZone = ({ onFileDrop }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onFileDrop(file);
      } else {
        toast({
          title: "잘못된 파일 형식",
          description: "이미지 파일만 업로드할 수 있습니다.",
          variant: "destructive",
        });
      }
    }
  }, [onFileDrop, toast]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-700 hover:border-slate-600'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-2">
        <img src="https://velog.velcdn.com/images/wldnjsl2001/post/9a921a26-2fc0-412d-97e2-9bb74aadec14/image.png" alt="Upload" className="h-16 w-16" />
        <p className="text-black text-[25px]">
          이미지를 여기에 드래그하거나 클릭하여 업로드하세요
        </p>
        <p className="text-sm text-slate-500">
          PNG, JPG, GIF 파일 지원
        </p>
      </div>
    </div>
  );
};

export default DropZone; 