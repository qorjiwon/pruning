import { useState } from "react";
import WebcamView from "@/components/WebcamView";
import CaptureButton from "@/components/CaptureButton";
import PhotoGallery from "@/components/PhotoGallery";
import DropZone from "@/components/DropZone";
import { Button } from "@/components/ui/button";
import { Grape, Upload, Video } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const { toast } = useToast();

  const handleCapture = (imageSrc: string) => {
    setCapturedImages((prev) => [imageSrc, ...prev]);
  };

  const handleDeleteImage = (index: number) => {
    setCapturedImages((prevImages) => 
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCapturedImages((prev) => [e.target.result as string, ...prev]);
        toast({
          title: "이미지 업로드",
          description: "이미지가 성공적으로 업로드되었습니다.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Grape className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
            <span>프루닝</span>
          </h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsWebcamActive(false)}
              className={`rounded-full px-6 flex items-center gap-2 ${
                !isWebcamActive 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-slate-700 hover:bg-slate-600'
              } text-white`}
            >
              <Upload className="h-4 w-4" />
              이미지 업로드
            </Button>
            <Button 
              onClick={() => setIsWebcamActive(true)}
              className={`rounded-full px-6 flex items-center gap-2 ${
                isWebcamActive 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-slate-700 hover:bg-slate-600'
              } text-white`}
            >
              <Video className="h-4 w-4" />
              실시간 라이브
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isWebcamActive ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <WebcamView onCapture={handleCapture} />
                <div className="mt-6 flex justify-center">
                  <CaptureButton onCapture={() => {
                    const webcamElement = document.querySelector("video");
                    if (webcamElement) {
                      const canvas = document.createElement("canvas");
                      canvas.width = webcamElement.videoWidth;
                      canvas.height = webcamElement.videoHeight;
                      canvas.getContext("2d")?.drawImage(webcamElement, 0, 0);
                      const image = canvas.toDataURL("image/png");
                      handleCapture(image);
                    }
                  }} />
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 w-full">
              <h2 className="text-xl font-semibold mb-4">갤러리</h2>
              <PhotoGallery 
                images={capturedImages} 
                onDelete={handleDeleteImage} 
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="max-w-2xl mx-auto">
                <DropZone onFileDrop={handleFileDrop} />
              </div>
            </div>
            
            <div className="md:w-1/3 w-full">
              <h2 className="text-xl font-semibold mb-4">갤러리</h2>
              <PhotoGallery 
                images={capturedImages} 
                onDelete={handleDeleteImage} 
              />
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
