import React, { useRef, useEffect, useState } from 'react';
import { Upload, Pen, Download, RotateCcw, ArrowLeft } from 'lucide-react';
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

  // Get patient data and navigation state
  const patient = location.state?.patient;
  const annotatedImages = location.state?.annotatedImages || [];
  const from = location.state?.from;

  // Load saved image from localStorage or initial image
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

  // Initialize and redraw canvas
  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match the uploaded image
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;

    // Draw the image on the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  }, [uploadedImage]);

  // Save image to localStorage
  const saveImageToLocalStorage = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('annotatedImage', dataUrl);
      alert('Image saved to localStorage!');
    }
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    if (from === 'form') {
      navigate(-1);
    } else {
      navigate('/doctordashboard/patients');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      setUploadedImage(img);
    };
    img.src = URL.createObjectURL(file);
  };

  // Get canvas coordinates
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.clientX !== undefined) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
  };

  // Handle drawing start (only if pen is active)
  const handleStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canvasRef.current || !isPenActive) return;
    const ctx = canvasRef.current.getContext('2d');
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  // Handle drawing move (only if pen is active)
  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canvasRef.current || !isDrawing || !isPenActive) return;
    const ctx = canvasRef.current.getContext('2d');
    const coords = getCanvasCoordinates(e);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  // Handle drawing end
  const handleEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDrawing) setIsDrawing(false);
    if (onImageChange && canvasRef.current) {
      onImageChange(canvasRef.current.toDataURL());
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (!canvasRef.current || !uploadedImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
  };

  // Download image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `medical-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
    saveImageToLocalStorage();
  };

  // Toggle pen tool
  const togglePen = () => {
    setIsPenActive(!isPenActive);
  };

  // Render loading state
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
                  <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Medical Image Annotation</h1>
              </div>
              {patient && (
                <div className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{patient.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="bg-white rounded-lg border-2 border-blue-300 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                <Upload className="mr-2 text-blue-500" size={18} />
                Upload Medical Image
              </h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center text-sm"
              >
                <Upload size={16} className="mr-2" />
                Upload Image
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all"
              >
                <Upload size={40} className="mx-auto mb-3 text-gray-400" />
                <p className="text-base text-gray-600 mb-1">Click to upload medical image</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, GIF formats</p>
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

  // Render main canvas
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Medical Image Annotation</h1>
            </div>
            {patient && (
              <div className="text-xs sm:text-sm text-gray-600">
                Patient: <span className="font-medium">{patient.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="bg-white rounded-lg border-2 border-blue-300 shadow-sm">
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <Upload className="mr-1 sm:mr-2 text-blue-500" size={16} />
              Medical Image Annotation
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={togglePen}
                  className={`p-1.5 sm:p-2 transition-all flex items-center text-xs sm:text-sm ${
                    isPenActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Pen Tool"
                >
                  <Pen size={14} className="mr-1" />
                  <span className="hidden sm:inline">Pen</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-6 h-6 sm:w-8 sm:h-8 border rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs text-gray-600">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-12 sm:w-16"
                />
                <span className="text-xs text-gray-600 w-3 sm:w-4">{brushSize}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded transition-all text-xs sm:text-sm"
                  title="Clear Annotations"
                >
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-gray-50 overflow-hidden flex justify-center">
            <div className="relative bg-white rounded-lg shadow-lg border w-full max-w-[800px] mx-auto overflow-auto">
              <canvas
                ref={canvasRef}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                className="rounded-lg w-full h-auto cursor-crosshair block mx-auto"
                style={{
                  touchAction: 'none',
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-t border-gray-200 bg-gray-50 gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Tool:</span> Click the pen icon to enable drawing
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center text-xs sm:text-sm"
              >
                <Upload size={14} className="mr-1" />
                <span className="hidden sm:inline">Change Image</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center text-xs sm:text-sm"
              >
                <Download size={14} className="mr-1" />
                <span className="hidden sm:inline">Save & Download</span>
              </button>
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
};

export default ImageAnnotationCanvas;

