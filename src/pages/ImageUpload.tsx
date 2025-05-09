import { useState, useEffect } from "react";
import DropZone from "@/components/DropZone";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { uploadImage, getRecommendationImage } from "@/api/image";

import { Loader2 } from "lucide-react";

type Props = {
    setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};

const ImageUpload: React.FC<Props> = ({ setMode }) => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const { toast } = useToast();
    const [dotCount, setDotCount] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4); // 0 → 1 → 2 → 3 → 0 ...
        }, 500); // 0.5초 간격

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, []);

    const handleFileDrop = async (file: File) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const base64 = e.target.result as string;
                    setOriginalImage(base64);

                    const result = await uploadImage(file); // ✅ 변경된 uploadImage 호출
                    setProcessedImage(result.visualized_image_base64); // ✅ 분석된 이미지 결과 사용

                    toast({ title: "처리 완료", description: "AI 분석 이미지가 도착했습니다." });
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            toast({ title: "오류 발생", description: "이미지 업로드 또는 분석 중 문제가 발생했습니다.", variant: "destructive" });
        }
    };


    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement("a");
        link.href = processedImage;
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

                {!originalImage ? (
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
                                            src={originalImage}
                                            alt="original"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 pr-3">
                                    <div className="w-full h-full overflow-hidden rounded-xl">
                                        {processedImage ? (
                                            <>
                                                <img
                                                    src={processedImage}
                                                    alt="processed"
                                                    className="w-full h-full object-cover"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Loader2 className="w-10 h-10 animate-spin text-[#2F321E]" />
                                                <p className="mb-2 font-medium">AI가 분석 중입니다{".".repeat(dotCount)}</p>
                                            </>
                                        )}
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
