import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

export default function ImageInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || 'select';
  
  const [showCamera, setShowCamera] = useState(mode === 'camera');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, uploading, error: uploadError } = useImageUpload();

  // Auto-start camera if mode is camera
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else if (mode === 'upload') {
      // Auto-trigger file input for upload mode
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  }, [mode]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsVideoReady(false);
      
      // Stop any existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      console.log('Starting camera...');
      
      // Try different camera configurations
      const constraints = [
        // Try back camera first
        {
          video: {
            facingMode: { exact: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        // Fallback to any camera
        {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        // Simple fallback
        { video: true }
      ];

      let stream = null;
      for (const constraint of constraints) {
        try {
          console.log('Trying constraint:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (err) {
          console.log('Constraint failed:', err);
          continue;
        }
      }

      if (!stream) {
        throw new Error('Could not access camera with any configuration');
      }

      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Handle video loading
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                setIsVideoReady(true);
              })
              .catch((err) => {
                console.error('Play failed:', err);
                setCameraError('Failed to start video playback');
              });
          }
        };

        const handleCanPlay = () => {
          console.log('Video can play');
          setIsVideoReady(true);
        };

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.addEventListener('canplay', handleCanPlay);
        
        // Cleanup listeners
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current.removeEventListener('canplay', handleCanPlay);
          }
        };
      }
      
      setShowCamera(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(`Camera access failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [cameraStream]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setIsVideoReady(false);
    setCameraError(null);
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      console.log('Cannot capture: video not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.log('Cannot get canvas context');
      return;
    }

    console.log('Capturing photo...');
    
    // Set canvas dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    console.log('Canvas dimensions:', canvas.width, canvas.height);

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Photo captured, blob size:', blob.size);
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        // Create file from blob for upload
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        uploadImage(file);
        
        // Navigate to results
        setTimeout(() => {
          navigate('/results', { state: { image: imageUrl } });
        }, 1000);
      }
    }, 'image/jpeg', 0.9);

    stopCamera();
  }, [isVideoReady, stopCamera, uploadImage, navigate]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      
      uploadImage(file);
      
      // Navigate to results
      setTimeout(() => {
        navigate('/results', { state: { image: imageUrl } });
      }, 1000);
    }
  }, [uploadImage, navigate]);

  const resetCapture = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    stopCamera();
  }, [capturedImage, stopCamera]);

  const goBack = () => {
    stopCamera();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Plant Disease Detection
          </h1>
          <p className="text-lg text-gray-600">
            {mode === 'camera' ? 'Use your camera to capture plant images' : 
             mode === 'upload' ? 'Upload an image from your device' : 
             'Choose how to add your plant image'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode Selection (only if no specific mode) */}
          {mode === 'select' && !showCamera && !capturedImage && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Camera Option */}
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                >
                  <Camera className="w-16 h-16 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Use Camera</h3>
                  <p className="text-gray-600 text-center">
                    Take a photo directly with your device camera
                  </p>
                </button>

                {/* File Upload Option */}
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group cursor-pointer">
                  <Upload className="w-16 h-16 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Image</h3>
                  <p className="text-gray-600 text-center">
                    Choose an image from your device
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Upload Mode - Direct File Input */}
          {mode === 'upload' && !capturedImage && (
            <div className="space-y-6">
              <div className="text-center">
                <label className="inline-flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group cursor-pointer">
                  <Upload className="w-20 h-20 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Select Image File</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Choose a clear image of your plant from your device
                  </p>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-700 font-medium">Click to browse files</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Camera View */}
          {showCamera && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Camera</h2>
                <button
                  onClick={stopCamera}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative bg-black rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto min-h-96 object-cover"
                  style={{ 
                    transform: 'scaleX(-1)',
                    display: isVideoReady ? 'block' : 'none'
                  }}
                />
                
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {cameraError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Camera Error</p>
                    <p className="text-red-600 text-sm">{cameraError}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={capturePhoto}
                  disabled={!isVideoReady}
                  className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {isVideoReady ? 'Capture Photo' : 'Camera Loading...'}
                </button>
              </div>
            </div>
          )}

          {/* Processing State */}
          {capturedImage && uploading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Image</h3>
              <p className="text-gray-600">Analyzing your plant image...</p>
            </div>
          )}

          {/* Error Display */}
          {(uploadError) && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{uploadError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}