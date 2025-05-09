
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WebcamViewProps {
  onCapture: (imageSrc: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const WebcamView = ({ onCapture, videoRef }: WebcamViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
          };
        }
      } catch (err) {
        console.error("웹캠 접근 에러:", err);
        setError("웹캠에 접근할 수 없습니다. 권한을 확인해주세요.");
        setIsLoading(false);
        toast({
          title: "웹캠 오류",
          description: "웹캠에 접근할 수 없습니다. 권한을 확인해주세요.",
          variant: "destructive",
        });
      }
    }

    setupWebcam();

    return () => {
      // Clean up the stream when component unmounts
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [toast]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-slate-800">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="aspect-video bg-slate-900 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              다시 시도
            </Button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full aspect-video object-cover transition-opacity duration-300 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
      />

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
        <span className="text-xs text-red-400">LIVE</span>
      </div>
    </div>
  );
};

export default WebcamView;