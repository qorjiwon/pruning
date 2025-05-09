import { useState } from "react";
import WebcamView from "@/components/WebcamView";
import CaptureButton from "@/components/CaptureButton";
import PhotoGallery from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import { Upload, Video } from "lucide-react";
import ImageUpload from "./imageUpload";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const NAV_ITEMS = [
  { label: "홈", href: "#" },
  { label: "사용법", href: "#" },
  { label: "FAQ", href: "#" },
];

const Index = () => {
  const [mode, setMode] = useState<"main" | "upload" | "webcam">("main");
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

  return (
    <div className="min-h-screen bg-[#F3F4CC] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-2 bg-[#2C6E43]">
        <div className="flex items-center gap-2">
          <img
            src="https://velog.velcdn.com/images/wldnjsl2001/post/856506ea-317b-4a82-ae1a-8c1d9e9228f6/image.png"
            alt="프루닝 로고"
            style={{ width: 48, height: 48 }}
          />
          <span className="text-2xl font-bold text-[#FFFFFF] ml-2">프루닝</span>
        </div>
        <div className="flex gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[#FFFFFF] font-semibold hover:underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 메인 호오오오오옴 */}
      {mode === "main" && (
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <img
            src="https://velog.velcdn.com/images/wldnjsl2001/post/856506ea-317b-4a82-ae1a-8c1d9e9228f6/image.png"
            alt="나무"
            style={{ width: 180, height: 180, margin: "0 auto 2rem" }}
          />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#3d3d3d]">
            "어느 가지를 자를지 고민되시나요?"
          </h2>
          <p className="text-[#7a7a7a] mb-8">
            AI 이미지 분석을 통해 나무의 건강을 해치는 가지를 찾아드립니다
          </p>
          <div className="flex gap-6 justify-center">
            <Button
              className="bg-[#bfc7a1] text-[#3d3d3d] px-20 py-8 rounded-lg text-lg font-semibold hover:bg-[#a6b47a]"
              onClick={() => setMode("upload")}
            >
              이미지 업로드하기
            </Button>
            <Button
              className="bg-[#bfc7a1] text-[#3d3d3d] px-20 py-8 rounded-lg text-lg font-semibold hover:bg-[#a6b47a]"
              onClick={() => setMode("webcam")}
            >
              웹캠으로 촬영하기
            </Button>
          </div>
        </main>
      )}
      {mode === "upload" && <ImageUpload setMode={setMode}/>}

      {/* 이미지 업로드/웹캠 모드 구현은 기존 코드 활용 */}
      {mode === "webcam" && (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <header className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <img src={'https://velog.velcdn.com/images/wldnjsl2001/post/856506ea-317b-4a82-ae1a-8c1d9e9228f6/image.png'} style={{ width: '271px', height: '272px' }}/>
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
                {/* <div className="flex-1">
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
                </div> */}
              </div>
            )}
          </main>
          <Toaster />
        </div>
      )}
    </div>
  );
};

export default Index;
