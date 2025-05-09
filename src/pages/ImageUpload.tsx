import { useState } from "react";
import DropZone from "@/components/DropZone";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};


const ImageUpload: React.FC<Props> = ({ setMode }) => {
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
      <main className="container px-4 py-14 mb-4">
        <h1 className="text-3xl font-bold mb-2">이미지 업로드하기</h1>

        <div className="flex items-center justify-between mb-2 mr-3">
            <p className="text-lg text-[#414014BA]">
                나무 사진을 업로드하거나, 이곳에 끌어다 놓아보세요. AI가 가지치기할 가지를 알려드려요.
            </p>
            <img 
                src='https://velog.velcdn.com/images/wldnjsl2001/post/9e3260fd-6d65-4027-ba8d-82d3b621d03e/image.png' 
                className="w-10 h-10"
                onClick={() => setMode("webcam")}
            />
        </div>

        {!capturedImages.length ? (
          <div className="bg-[#E3DFB278] rounded-[50px] p-12 flex items-center justify-center">
            <DropZone onFileDrop={handleFileDrop} />
          </div>
        ) : (
          <>
            <div className="bg-[#E3DFB278] rounded-[50px] p-4 pb-8 flex flex-col gap-4">
              <div className="text-base text-right leading-relaxed mt-2 mr-5">
                <p className="mb-1">
                  <span className="text-red-600 font-semibold">빨간색</span>: 주줄기&nbsp;&nbsp;|&nbsp;&nbsp;
                  <span className="text-yellow-500 font-semibold">노란색</span>: 2년 이상 자란 가지&nbsp;&nbsp;|&nbsp;&nbsp;
                  <span className="text-green-700 font-semibold">초록색</span>: 2년 이하 자란 가지
                </p>
                <p>
                  <span className="text-red-600 font-bold">X</span>: 가지치기 대상 위치
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 pl-3">
  <div className="w-full h-full overflow-hidden rounded-xl">
    <img
      src={capturedImages[0]}
      alt="original"
      className="w-full h-full object-cover"
    />
  </div>
</div>

<div className="flex-1 pr-3">
  <div className="w-full h-full overflow-hidden rounded-xl">
    <img
      src={capturedImages[0]}
      alt="processed"
      className="w-full h-full object-cover opacity-80"
    />
  </div>
</div>
              </div>

            </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#A9BB8B] hover:bg-[#bfc7a1] text-[#000000] rounded-lg px-4 py-2 flex items-center gap-2 mt-4"
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
