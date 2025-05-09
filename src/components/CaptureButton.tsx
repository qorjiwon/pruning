
import { useState } from "react";
import { Camera } from "lucide-react";

interface CaptureButtonProps {
  onCapture: () => void;
}

const CaptureButton = ({ onCapture }: CaptureButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleCapture = () => {
    setIsPressed(true);
    onCapture();
    
    // Visual feedback animation
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
  };

  return (
    <button
      onClick={handleCapture}
      className={`relative flex items-center justify-center p-6 rounded-full 
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:from-blue-700 hover:to-indigo-700
      shadow-lg hover:shadow-xl
      transform transition-all duration-200
      ${isPressed ? 'scale-90' : 'scale-100'}`}
      aria-label="Capture photo"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`rounded-full border-2 border-white h-16 w-16 
          transition-transform duration-200 
          ${isPressed ? 'scale-90' : 'scale-100'}`}>
        </div>
      </div>
      <Camera className={`h-8 w-8 text-white z-10 transition-transform duration-200
        ${isPressed ? 'scale-90' : 'scale-100'}`} />
    </button>
  );
};

export default CaptureButton;
