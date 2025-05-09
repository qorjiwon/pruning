import { useState, useEffect, useRef } from "react";
import WebcamView from "@/components/WebcamView";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/api/image";

type Props = {
  setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};

const Webcam: React.FC<Props> = ({ setMode }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWebcamActive && videoRef.current) {
      interval = setInterval(async () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);

        const base64 = canvas.toDataURL("image/jpeg");
        const file = dataURLtoFile(base64, "frame.jpg");
        const result = await uploadImage(file);

        setCapturedImages((prev) => [result.visualized_image_base64, ...prev.slice(0, 7)]); // 최대 8개까지 유지
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [isWebcamActive]);

  const startCapture = () => {
    setIsWebcamActive(true);
    toast({ title: "웹캠 활성화", description: "웹캠이 시작되었습니다." });
  };

  const stopCapture = () => {
    setIsWebcamActive(false);
    toast({ title: "웹캠 중단", description: "웹캠 촬영이 중단되었습니다." });
  };

  return (
    <div className="min-h-screen bg-[#F5F5D5] text-[#2F321E]">
      <main className="container px-4 py-14 mb-4">
        <h1 className="text-3xl font-bold mb-2">웹캠으로 실시간 촬영하기</h1>
        <div className="flex items-center justify-between mb-2 mr-3">
          <p className="text-[#414014BA] text-lg">
            웹캠을 켜고 나무를 촬영해 보세요. 실시간 분석으로 가지치기 위치를 추정해드려요.
          </p>
          <div className="flex items-center gap-6">
            <button
              className="flex items-center justify-center text-[#F3F4CC] hover:opacity-80 transition rounded-[45px] w-40 h-11 bg-[#2C6E49]"
              onClick={stopCapture}
            >
              촬영 중단하기
            </button>
            <img
              src="https://velog.velcdn.com/images/wldnjsl2001/post/e63136b2-ed73-4118-8f14-260e504c096f/image.png"
              className="w-10 h-10"
              onClick={() => setMode("upload")}
            />
          </div>
        </div>

        {/* 영상 촬영 박스 */}
        <div className="bg-[#E3DFB278] p-12 rounded-[50px] flex flex-col items-center justify-center text-center w-full h-[600px]">
          {!isWebcamActive ? (
            <button
              onClick={startCapture}
              className="flex flex-col items-center justify-center text-[#2F321E] hover:opacity-80 transition rounded-[50px] border border-dashed border-[#2F321E] w-full h-full p-6 aspect-video"
            >
              <img
                src="https://velog.velcdn.com/images/wldnjsl2001/post/5dad4430-6a8b-450b-ace2-26a170ba91ed/image.png"
                alt="웹캠 시작 아이콘"
                className="w-20 h-20 mb-3"
              />
              <span className="text-xl font-semibold">영상 촬영 시작하기</span>
            </button>
          ) : (
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* 왼쪽: 웹캠 */}
              <div className="flex-1">
                <WebcamView videoRef={videoRef} onCapture={() => {}} />
              </div>

              {/* 오른쪽: 분석 이미지 그리드 */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-2">
                  {capturedImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`분석 이미지 ${i}`}
                      className="w-full aspect-square object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Webcam;

function dataURLtoFile(base64: string, fileName: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

