
import { useState } from "react";
import WebcamView from "@/components/WebcamView";
import CaptureButton from "@/components/CaptureButton";
import PhotoGallery from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import { Webcam } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const handleCapture = (imageSrc: string) => {
    setCapturedImages((prev) => [imageSrc, ...prev]);
  };

  const handleDeleteImage = (index: number) => {
    setCapturedImages((prevImages) => 
      prevImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Webcam className="h-6 w-6 md:h-8 md:w-8" />
            <span>프루닝</span>
          </h1>
          {!isWebcamActive && (
            <Button 
              onClick={() => setIsWebcamActive(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              시작하기
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/50 p-10 rounded-2xl flex flex-col items-center max-w-lg mx-auto">
              <Webcam className="h-20 w-20 mb-6 text-blue-400" />
              <h2 className="text-2xl font-bold mb-4">프루닝에 오신 것을 환영합니다</h2>
              <p className="text-slate-300 mb-8 text-center">
                웹캠을 활성화하고 사진을 촬영하여 갤러리에 저장할 수 있습니다.
              </p>
              <Button 
                onClick={() => setIsWebcamActive(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg"
              >
                시작하기
              </Button>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
