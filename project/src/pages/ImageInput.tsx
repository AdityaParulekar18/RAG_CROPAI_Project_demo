import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Camera, X, ArrowLeft, Loader, Video } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

const ImageInput = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputType = searchParams.get('type');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { uploadImage, updateAnalysisStatus, uploading, error } = useImageUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Fallback to file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setSelectedImage(canvas.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleSubmit = async () => {
    if (!selectedImage || !selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Upload image to Supabase
      const uploadedImage = await uploadImage(selectedFile);
      
      if (uploadedImage) {
        // Update status to processing
        await updateAnalysisStatus(uploadedImage.id, 'processing');
        
        // Simulate AI processing (replace with actual AI API call)
        setTimeout(async () => {
          const mockResults = {
            cropType: 'Rice (Oryza sativa)',
            disease: 'Bacterial Leaf Blight',
            confidence: 87
          };
          
          // Update with results
          await updateAnalysisStatus(uploadedImage.id, 'completed', mockResults);
          
          navigate('/results', { 
            state: { 
              image: selectedImage,
              imageId: uploadedImage.id,
              results: mockResults
            } 
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-green-800 text-center mb-8">
            {inputType === 'camera' ? 'Capture Crop Image' : 'Upload Crop Image'}
          </h1>

          {!selectedImage ? (
            <div className="space-y-6">
              {inputType === 'upload' ? (
                <div className="border-2 border-dashed border-green-300 rounded-xl p-12 text-center hover:border-green-400 transition-colors">
                  <Upload className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Choose an image to upload
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a clear photo of your crop showing any visible issues
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Select Image
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {!isCameraActive ? (
                    <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-12">
                      <Camera className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Camera Capture
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Click to open your device camera and capture a crop image
                      </p>
                      <button
                        onClick={startCamera}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Start Camera
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-80 object-cover rounded-lg bg-black"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          onClick={captureImage}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <Camera className="h-5 w-5" />
                          <span>Capture</span>
                        </button>
                        <button
                          onClick={stopCamera}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isProcessing ? (
                <div className="text-center py-8">
                  <Loader className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {uploading ? 'Uploading Image...' : 'Processing Image...'}
                  </h3>
                  <p className="text-gray-600">
                    Our AI is analyzing your crop image for diseases and pests
                  </p>
                  {error && (
                    <p className="text-red-600 mt-2">Error: {error}</p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Analyze Image
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Click to start AI analysis of your crop image
                  </p>
                  {error && (
                    <p className="text-red-600 mt-2">Error: {error}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInput;