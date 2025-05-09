import { useState } from "react";
import WebcamView from "@/components/WebcamView";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type Props = {
  setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};

const Webcam: React.FC<Props> = ({ setMode }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const { toast } = useToast();

  const startCapture = () => {
    setIsWebcamActive(true);
    toast({ title: "웹캠 활성화", description: "웹캠이 시작되었습니다." });
  };

  return (
    <div className="min-h-screen bg-[#F5F5D5] text-[#2F321E]">
      <main className="container px-4 py-14 mb-4">
        <h1 className="text-3xl font-bold mb-2">웹캠으로 실시간 촬영하기</h1>
        <div className="flex items-center justify-between mb-2 mr-3">
            <p className="text-[#414014BA] text-lg">
            웹캠을 켜고 나무를 촬영해 보세요. 실시간 분석으로 가지치기 위치를 추정해드려요.
            </p>
            <img
                src="https://velog.velcdn.com/images/wldnjsl2001/post/e63136b2-ed73-4118-8f14-260e504c096f/image.png"
                alt="웹캠 아이콘"
                className="w-10 h-10"
                onClick={() => setMode("upload")}
            />
        </div>

        {/* 영상 촬영 빡스 */}
        <div className="bg-[#E3DFB278] p-12 rounded-[50px] flex flex-col items-center justify-center aspect-video text-center w-full h-full">
          {!isWebcamActive ? (
            <button
              onClick={startCapture}
              className="flex flex-col items-center justify-center text-[#2F321E] hover:opacity-80 transition rounded-[50px] border border-dashed border-[#2F321E] w-full h-full p-8"
            >
              <img
            src="https://velog.velcdn.com/images/wldnjsl2001/post/5dad4430-6a8b-450b-ace2-26a170ba91ed/image.png"
            alt="웹캠 시작 아이콘"
            className="w-20 h-20 mb-3"
              />
              <span className="text-xl font-semibold">영상 촬영 시작하기</span>
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <WebcamView onCapture={(imageSrc) => console.log("Captured image:", imageSrc)} />
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Webcam;
