import { useState, useEffect } from "react";
import DropZone from "@/components/DropZone";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { uploadImage } from "@/api/image";

type Props = {
    setMode: React.Dispatch<React.SetStateAction<"main" | "upload" | "webcam">>;
};

const ImageUpload: React.FC<Props> = ({ setMode }) => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [comment, setComment] = useState<string | null>(null);
    const { toast } = useToast();
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleFileDrop = async (file: File) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const base64 = e.target.result as string;
                    setOriginalImage(base64);

                    const result = await uploadImage(file);
                    setProcessedImage(result.visualized_image_base64);
                    setComment(result.chatgpt_comment);

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
                <h1 className="text-3xl font-bold mb-4">이미지 업로드하기</h1>

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
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 flex-col bg-[#E3DFB278] rounded-[30px] p-4 h-[550px] flex items-center justify-center">
                                <div className="flex items-center justify-between mb-4 w-full px-4">
                                    <div className=" px-12">
                                        <p>
                                            <span className="text-red-600 font-semibold">빨간색</span>: 주줄기
                                        </p>
                                        <p>
                                            <span className="text-yellow-500 font-semibold">노란색</span>: 2년 이상 자란 가지
                                        </p>
                                        <p>
                                            <span className="text-green-700 font-semibold">초록색</span>: 2년 이하 자란 가지
                                        </p>
                                        <p>
                                            <span className="text-red-600 font-bold">X</span>: 가지치기 대상 위치
                                        </p>
                                    </div>
                                    {originalImage && (
                                        <img src={originalImage} alt="원본 이미지" className="w-[260px] object-contain rounded-xl" />
                                    )}
                                </div>
                                {processedImage ? (
                                    <img src={processedImage} alt="AI 분석 결과" className="max-h-full object-contain rounded-xl" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-10 h-10 animate-spin text-[#2F321E]" />
                                        <p className="font-medium">AI가 분석 중입니다{".".repeat(dotCount)}</p>
                                    </div>
                                )}
                            </div>

                            {/* 우측 설명 텍스트 */}
                            <div className="flex-1 bg-[#F5F5D5]">
                                <div className="bg-[#E3DFB278] flex items-center justify-center rounded-[30px] p-6 h-[550px] text-xl leading-[50px] space-y-[20px]">
                                    이 가지치기는 포도나무가 더욱 건강하게 자랄 수 있는<br />
                                    기반을 마련해줄 거예요. 내년에는 더욱 크고 달콤한 포도송이를<br />
                                    기대하셔도 좋습니다! 이 가지치기는 포도나무가 더욱<br />
                                    건강하게 자랄 수 있는 기반을 마련해줄 거예요. 내년에는<br />
                                    더욱 크고 달콤한 포도송이를 기대하셔도 좋습니다!
                                </div>
                            </div>
                        </div>

                        {/* 다운로드 버튼 */}
                        <div className="flex justify-end mt-6">
                            <Button
                                className="bg-[#A9BB8B] hover:bg-[#bfc7a1] text-[#000000] font-semibold rounded-lg px-4 py-2 flex items-center gap-2"
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
