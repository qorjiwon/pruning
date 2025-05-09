
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoGalleryProps {
  images: string[];
  onDelete?: (index: number) => void;
}

const PhotoGallery = ({ images, onDelete }: PhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  if (images.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-slate-400">사진이 없습니다. 캡처 버튼을 눌러 사진을 촬영하세요.</p>
      </div>
    );
  }

  const handleImageClick = (img: string, index: number) => {
    setSelectedImage(img);
    setSelectedIndex(index);
  };

  const handleDelete = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete(index);
      toast({
        title: "사진 삭제",
        description: "사진이 성공적으로 삭제되었습니다.",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-slate-700 group"
            onClick={() => handleImageClick(img, index)}
          >
            <img 
              src={img} 
              alt={`Captured ${index}`} 
              className="w-full h-full object-cover"
            />
            {onDelete && (
              <button
                className="absolute top-2 right-2 p-1.5 bg-slate-800/80 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                onClick={(e) => handleDelete(index, e)}
                aria-label="Delete photo"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            )}
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
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Selected capture" 
                className="w-full h-auto rounded"
              />
              {onDelete && selectedIndex !== null && (
                <button
                  className="absolute bottom-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(null);
                    if (onDelete && selectedIndex !== null) {
                      onDelete(selectedIndex);
                      toast({
                        title: "사진 삭제",
                        description: "사진이 성공적으로 삭제되었습니다.",
                      });
                    }
                  }}
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
