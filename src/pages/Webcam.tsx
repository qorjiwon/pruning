import { useState, useEffect } from "react";
import WebcamView from "@/components/WebcamView";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type Props = {
  setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};

const Webcam: React.FC<Props> = ({ setMode }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const { toast } = useToast();

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   if (isWebcamActive) {
  //     interval = setInterval(async () => {
  //       const video = document.querySelector("video");
  //       if (!video) return;

  //       const canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       canvas.getContext("2d")?.drawImage(video, 0, 0);

  //       const base64 = canvas.toDataURL("image/jpeg");
  //       const file = dataURLtoFile(base64, "frame.jpg");

  //       // POST: 실시간 백엔드 요청
  //       const response = await uploadRealtimeFrame(file);
  //       setProcessedImage(response.imageUrl); // 분석 결과 반영
  //     }, 1000); // 1초마다 프레임 전송
  //   }

  //   return () => clearInterval(interval); // 해제
  // }, [isWebcamActive]);

  const [processedImage, setProcessedImage] = useState<string | null>(null);

  useEffect(() => {
    const video = document.querySelector("video");
    let interval: NodeJS.Timeout;

    if (video) {
      interval = setInterval(async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg");

        const file = dataURLtoFile(base64, "frame.jpg");
        const res = await uploadRealtimeFrame(file); // POST 요청
        setProcessedImage(res.image_url); // 받은 분석 이미지 교체
      }, 1000); // 매 1초마다 프레임 전송
    }

    return () => clearInterval(interval);
  }, []);



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
                {processedImage && <img src={processedImage} alt="AI 처리 결과" className="rounded-xl shadow-md w-full max-w-3xl" />}

            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Webcam;
