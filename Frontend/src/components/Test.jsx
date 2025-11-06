// import React, { useState } from "react";

// function CreateTestComponent() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [extractedTexts, setExtractedTexts] = useState([]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
    
//     // Check if adding new files would exceed the limit
//     if (images.length + files.length > 6) {
//       alert(`You can only upload up to 6 images. You have ${images.length} already selected.`);
//       return;
//     }
    
//     const newImageUrls = files.map(file => ({
//       file: file,
//       preview: URL.createObjectURL(file)
//     }));
    
//     // Add new images to existing ones instead of replacing
//     setImages([...images, ...newImageUrls]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (images.length === 0) {
//       alert("Please select at least one image");
//       return;
//     }

//     setLoading(true);
//     const texts = [];

//     try {
//       for (let i = 0; i < images.length; i++) {
//         const formData = new FormData();
//         formData.append("image", images[i].file);
        
//         // Simulating API call - replace with your actual endpoint
//         const res = await fetch("http://localhost:3000/extract/upload-multiple", {
//           method: "POST",
//           body: formData
//         });
//         const data = await res.json();
//         texts.push(data.text);
        
//         // Temporary simulation
//         await new Promise(resolve => setTimeout(resolve, 500));
//         texts.push(`Extracted text from image ${i + 1}`);
//       }
//       setExtractedTexts(texts);
//       alert("All images processed successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong while extracting text.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//         <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
//           Create Your Own Test
//         </h2>
        
//         <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-md mb-8">
//           <p className="text-gray-700 mb-2">• Upload images of questions</p>
//           <p className="text-gray-700 mb-2">• Clear images must</p>
//           <p className="text-gray-700">• Up to six images you can</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex flex-wrap gap-4 items-center">
//             <label className="flex-1 min-w-[200px] cursor-pointer">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <div className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
//                 <span className="text-xl">📁</span>
//                 <span>Choose Images (Max 6)</span>
//               </div>
//             </label>
            
//             {images.length > 0 && (
//               <button 
//                 onClick={handleUpload}
//                 disabled={loading}
//                 className={`px-7 py-3 rounded-md font-medium transition-colors ${
//                   loading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-green-600 hover:bg-green-700 text-white'
//                 }`}
//               >
//                 {loading ? "Processing..." : `Upload & Extract (${images.length})`}
//               </button>
//             )}
//           </div>
//         </div>

//         {images.length > 0 && (
//           <div className="mt-8 pt-8 border-t border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900 mb-5">
//               Selected Images:
//             </h3>
//             <div className="flex flex-wrap gap-3">
//               {images.map((img, index) => (
//                 <div key={index} className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 w-36">
//                   <img 
//                     src={img.preview} 
//                     alt={`Question ${index + 1}`}
//                     className="w-full h-32 object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
//                   >
//                     ✕
//                   </button>
//                   <p className="text-center py-2 text-xs text-gray-600 font-medium">
//                     Image {index + 1}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CreateTestComponent;

import React, { useState } from "react";
import TestInstructions from "./TestInstructions";
import PracticeTest from "./PracticeTest";
import toast from "react-hot-toast";

function CreateTestComponent() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState("create");
  const [testQuestions, setTestQuestions] = useState([]);
  const [testTimeLimit, setTestTimeLimit] = useState(30);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 6) {
      alert(`You can only upload up to 6 images. You have ${images.length} already selected.`);
      return;
    }

    const newImageUrls = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImageUrls]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img.file));

      const res = await fetch("http://localhost:3000/extract/upload-multiple", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP Error. Status: ${res.status}`);

      const data = await res.json();

      console.log("All MCQs Extracted and Formatted:");
      console.log(data);

      setResult(data);
      setCurrentPage("instructions");
      toast.success("All images processed successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleStartTest = (questions, timeLimit) => {
    setTestQuestions(questions);
    setTestTimeLimit(timeLimit);
    setCurrentPage("test");
  };

  const handleGoBack = () => {
    setCurrentPage("create");
    setResult(null);
  };

  const handleExitTest = () => {
    setCurrentPage("create");
    setImages([]);
    setResult(null);
    setTestQuestions([]);
  };

  if (currentPage === "instructions") {
    return (
      <TestInstructions 
        testData={result}
        onStartTest={handleStartTest}
        onGoBack={handleGoBack}
      />
    );
  }

  if (currentPage === "test") {
    return (
      <PracticeTest
        questions={testQuestions}
        timeLimit={testTimeLimit}
        onExit={handleExitTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Create Your Own Test
        </h2>

        <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-md mb-8">
          <p className="text-gray-700 mb-2">Upload images of questions</p>
          <p className="text-gray-700 mb-2">Images must be clear</p>
          <p className="text-gray-700">You can upload up to six images</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex-1 min-w-[200px] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                <span>Choose Images (Max 6)</span>
              </div>
            </label>

            {images.length > 0 && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`px-7 py-3 rounded-md font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Processing..." : `Upload and Extract (${images.length})`}
              </button>
            )}
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Selected Images:
            </h3>
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 w-36"
                >
                  <img
                    src={img.preview}
                    alt={`Question ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                  >
                    X
                  </button>
                  <p className="text-center py-2 text-xs text-gray-600 font-medium">
                    Image {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTestComponent;