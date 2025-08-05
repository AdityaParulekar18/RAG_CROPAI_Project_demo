import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Leaf, Droplets, Clock, CheckCircle } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image;

  const handleTryAnother = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!image) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Analysis Results
            </h1>
            <p className="text-green-100 text-center mt-2">
              AI-powered crop disease detection complete
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-800">Analyzed Image</h2>
              <img
                src={image}
                alt="Analyzed crop"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Crop Identification</h3>
                </div>
                <p className="text-2xl font-bold text-green-700">Rice (Oryza sativa)</p>
                <p className="text-green-600 mt-1">Confidence: 94%</p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Detected Issue</h3>
                </div>
                <p className="text-2xl font-bold text-red-700">Bacterial Leaf Blight</p>
                <p className="text-red-600 mt-1">Confidence: 87%</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bacterial Leaf Blight is a serious bacterial disease that affects rice plants. 
                  It causes leaf lesions that start as water-soaked spots and develop into brown 
                  streaks with yellow halos. This disease can significantly reduce yield if left untreated.
                </p>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Droplets className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800">Treatment Recommendations</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Apply streptomycin spray (200-300 ppm) early morning</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Improve field drainage to reduce humidity</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Remove infected plant debris</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-700">Apply copper-based fungicide as preventive measure</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-blue-800">Important Note</p>
                </div>
                <p className="text-sm text-gray-600">
                  Final AI prediction model will be integrated after training completion. 
                  This is a placeholder result for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 text-center">
            <button
              onClick={handleTryAnother}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Try Another Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;