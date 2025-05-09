
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
}

const PhotoGallery = ({ images }: PhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-slate-400">사진이 없습니다. 캡처 버튼을 눌러 사진을 촬영하세요.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-slate-700"
            onClick={() => setSelectedImage(img)}
          >
            <img 
              src={img} 
              alt={`Captured ${index}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="p-1 max-w-3xl bg-slate-900 border-slate-700">
          <button 
            className="absolute top-2 right-2 p-1 bg-slate-800 rounded-full z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Selected capture" 
              className="w-full h-auto rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
