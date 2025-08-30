import React, { useRef, useEffect, useState } from 'react';
import { Upload, Pen, Download, RotateCcw, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const ImageAnnotationCanvas = ({ initialImage, onImageChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(2);
  const [brushColor, setBrushColor] = useState('#01D48C');
  const [isPenActive, setIsPenActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const patient = location.state?.patient;
  const annotatedImages = location.state?.annotatedImages || [];
  const from = location.state?.from;

  useEffect(() => {
    const savedImage = localStorage.getItem('annotatedImage');
    if (savedImage) {
      const img = new Image();
      img.onload = () => setUploadedImage(img);
      img.src = savedImage;
    } else {
      const imageToLoad = initialImage || (annotatedImages.length > 0 ? annotatedImages[0].originalFile : null);
      if (imageToLoad) {
        const img = new Image();
        img.onload = () => setUploadedImage(img);
        img.src = imageToLoad;
      }
    }
  }, [initialImage, annotatedImages]);

  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  }, [uploadedImage]);

  const saveImageToLocalStorage = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('annotatedImage', dataUrl);
    }
  };

  const handleBackNavigation = () => {
    if (from === 'form') {
      navigate(-1);
    } else {
      navigate('/doctordashboard/patients');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setUploadedImage(img);
    img.src = URL.createObjectURL(file);
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    if (!isPenActive) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const coords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !isPenActive) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const coords = getCanvasCoordinates(e);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    if (onImageChange && canvasRef.current) {
      onImageChange(canvasRef.current.toDataURL());
    }
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current || !uploadedImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `medical-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
    saveImageToLocalStorage();
  };

  const togglePen = () => {
    setIsPenActive(!isPenActive);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (!uploadedImage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackNavigation}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="bg-white rounded-lg border-2 border-blue-300 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center text-sm"
              >
                <Upload size={16} className="mr-2" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all"
              >
                <Upload size={40} className="mx-auto mb-3 text-gray-400" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 overflow-hidden">
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex items-center gap-1">
              {isDrawerOpen && (
                <>
                  <button
                    type="button"
                    onClick={togglePen}
                    className={`p-1.5 rounded-lg transition-all flex items-center ${
                      isPenActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Pen Tool"
                  >
                    <Pen size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Change Image"
                  >
                    <Upload size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Save & Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Clear Annotations"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                  <div className="flex items-center gap-1 px-2">
                    <span className="text-xs font-medium">Size:</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs w-4">{brushSize}</span>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={toggleDrawer}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Toggle Tools"
              >
                {isDrawerOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 py-0 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg border w-full mx-auto overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={isPenActive ? startDrawing : undefined}
            onMouseMove={isPenActive ? draw : undefined}
            onMouseUp={isPenActive ? stopDrawing : undefined}
            onMouseLeave={isPenActive ? stopDrawing : undefined}
            onTouchStart={isPenActive ? startDrawing : undefined}
            onTouchMove={isPenActive ? draw : undefined}
            onTouchEnd={isPenActive ? stopDrawing : undefined}
            className="rounded-lg w-full h-auto block mx-auto"
            style={{
              touchAction: 'none',
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain',
              overflow: 'hidden',
            }}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageAnnotationCanvas;