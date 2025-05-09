import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import Webcam from "./Webcam";

const NAV_ITEMS = [
  { label: "홈", href: "#" },
  { label: "사용법", href: "#" },
  { label: "FAQ", href: "#" },
];

const Index = () => {
  const [mode, setMode] = useState<"main" | "upload" | "webcam">("main");

  return (
    <div className="min-h-screen bg-[#F3F4CC] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-2 bg-[#2C6E43]">
        <div className="flex items-center gap-2">
          <img
            src="https://velog.velcdn.com/images/wldnjsl2001/post/856506ea-317b-4a82-ae1a-8c1d9e9228f6/image.png"
            alt="프루닝 로고"
            style={{ width: 48, height: 48 }}
          />
          <span className="text-3xl font-bmjua text-[#FFFFFF] ml-2">프루닝</span>
        </div>
        <div className="flex gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[20px] text-[#FFFFFF] font-bmjua hover:underline"
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
      {mode === "webcam" && <Webcam setMode={setMode} />}
    </div>
  );
};

export default Index;
