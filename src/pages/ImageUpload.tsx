import { useState } from "react";
import DropZone from "@/components/DropZone";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ImageUpload: React.FC = ({ setMode }) => {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCapturedImages([e.target.result as string]);
        toast({
          title: "이미지 업로드",
          description: "이미지가 성공적으로 업로드되었습니다.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const image = capturedImages[0];
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "pruned_image.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F5F5D5] text-[#2F321E]">
      <main className="container px-4 py-12">
        <h1 className="text-2xl font-bold mb-2" style={{ fontSize: "40px" }}>
            이미지 업로드하기
        </h1>
        <div className="flex items-center justify-between mb-2 mr-3">
            <p className="text-sm text-[#414014BA]" style={{ fontSize: "20px" }}>
                나무 사진을 업로드하기, 이것에 꽃이 핀 나이보세요. AI가 가지치기할 가지를 알려드려요.
            </p>
            <img 
                src='https://velog.velcdn.com/images/wldnjsl2001/post/9e3260fd-6d65-4027-ba8d-82d3b621d03e/image.png' 
                style={{ width: "50px", height: "50px" }} 
            />
        </div>

        {!capturedImages.length ? (
          <div className="bg-[#E3DFB278] rounded-[50px] p-12 flex items-center justify-center">
            <DropZone onFileDrop={handleFileDrop} />
          </div>
        ) : (
          <>
            <div className="bg-[#E3DFB278] rounded-[50px] p-8 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 border border-dashed border-[#2F321E] p-4 flex flex-col items-center justify-center aspect-square">
                  <img src={capturedImages[0]} alt="original" className="max-h-64 object-contain" style={{ width: "100%", height: "100%" }} />
                </div>
                <div className="flex-1 border border-dashed border-[#2F321E] rounded-xl p-4 flex flex-col items-center justify-center aspect-square">
                  <img src={capturedImages[0]} alt="processed" className="max-h-64 object-contain opacity-80" />
                </div>
              </div>
            </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#A9BB8B] hover:bg-[#bfc7a1] text-[#000000] font-semibold rounded-lg px-4 py-2 flex items-center gap-2 mt-4"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  이미지 다운로드
                </Button>
              </div>
          </>
        )}
      </main>

      <Toaster />
    </div>
  );
};

export default ImageUpload;
