// import React, { useState } from 'react';

// const QuestionPaperUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [courseName, setCourseName] = useState('');
//   const [courseCode, setCourseCode] = useState('');
//   const [yearOfStudy, setYearOfStudy] = useState('');
//   const [year, setYear] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadError, setUploadError] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setUploadError('');
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       setUploadError('Please select a file to upload.');
//       return;
//     }
//     if (!courseName.trim()) {
//       setUploadError('Please enter the course name.');
//       return;
//     }
//     if (!courseCode.trim()) {
//       setUploadError('Please enter the course code.');
//       return;
//     }
//     if (!yearOfStudy.trim()) {
//       setUploadError('Please enter the year of study.');
//       return;
//     }
//     if (!year.trim()) {
//       setUploadError('Please enter the year.');
//       return;
//     }

//     setUploading(true);
//     setUploadSuccess(false);
//     setUploadError('');

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       console.log('Uploading file:', selectedFile.name);
//       console.log('Course Name:', courseName);
//       console.log('Course Code:', courseCode);
//       console.log('Year of Study:', yearOfStudy);
//       console.log('Year:', year);

//       setUploadSuccess(true);
//       setSelectedFile(null);
//       setCourseName('');
//       setCourseCode('');
//       setYearOfStudy('');
//       setYear('');
//     } catch (error) {
//       setUploadError(error.message || 'An error occurred during upload.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Question Paper</h2>

//       {uploadSuccess && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
//           <strong className="font-bold">Success!</strong>
//           <span className="block sm:inline ml-2">Your question paper has been uploaded.</span>
//         </div>
//       )}

//       {uploadError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           <strong className="font-bold">Error!</strong>
//           <span className="block sm:inline ml-2">{uploadError}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
//             Course Name<span className='text-red-600 ml-1'>*</span>
//           </label>
//           <input
//             type="text"
//             id="courseName"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., Probability & Statistics"
//             value={courseName}
//             onChange={(e) => setCourseName(e.target.value)}
//             disabled={uploading}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
//             Course Code<span className='text-red-600 ml-1'>*</span>
//           </label>
//           <input
//             type="text"
//             id="courseCode"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., 22SH101"
//             value={courseCode}
//             onChange={(e) => setCourseCode(e.target.value)}
//             disabled={uploading}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
//             Year of Study<span className='text-red-600 ml-1'>*</span>
//           </label>
//           <input
//             type="text"
//             id="yearOfStudy"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., I Year"
//             value={yearOfStudy}
//             onChange={(e) => setYearOfStudy(e.target.value)}
//             disabled={uploading}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
//             Year<span className='text-red-600 ml-1'>*</span>
//           </label>
//           <input
//             type="number"
//             id="year"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="e.g., 2023"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             disabled={uploading}
//             min="1900"
//             max={new Date().getFullYear()}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Question Paper (PDF, DOCX, etc.)<span className='text-red-600 ml-1'>*</span>
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 48 48"
//                 aria-hidden="true"
//               >
//                 <path
//                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m-4-4V20m-4 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m-4-4V20"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <div className="flex text-sm text-gray-600">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   <span>Upload a file</span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.odt"
//                     disabled={uploading}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 {selectedFile ? selectedFile.name : 'PDF, DOCX, ODT up to 10MB'}
//               </p>
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//             uploading
//               ? 'bg-blue-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//           }`}
//           disabled={uploading}
//         >
//           {uploading ? (
//             <svg
//               className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           ) : (
//             'Upload Paper'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default QuestionPaperUpload;


// src/pages/Academics/QuestionPaperUpload.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications
import AuthContext from '../Auth/AuthContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const QuestionPaperUpload = () => {
  const { user } = useContext(AuthContext); // Get user info (especially token) from context
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated tags
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in (though ProtectedRoute should handle this)
  if (!user || !user.token) {
    navigate('/login');
    return null; // Or render a message
  }

  const handleFileChange = (e) => {
    // Basic file type validation (more robust validation should be on backend)
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, and DOCX files are allowed.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !subject || !examName || !year || !selectedFile) {
      toast.error('Please fill in all required fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subject', subject);
    formData.append('exam_name', examName);
    formData.append('year', year);
    formData.append('tags', tags); // Send as comma-separated string
    formData.append('questionPaperFile', selectedFile); // 'questionPaperFile' must match Multer field name

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/question-papers/upload',
        formData,
        config
      );

      toast.success('Question paper uploaded successfully! It is now awaiting admin approval.');
      // Clear form
      setTitle('');
      setDescription('');
      setSubject('');
      setExamName('');
      setYear('');
      setTags('');
      setSelectedFile(null);
      if (e.target.elements.questionPaperFile) {
        e.target.elements.questionPaperFile.value = ''; // Clear file input
      }

    } catch (err) {
      const errorMessage = err.response && err.response.data.message
        ? err.response.data.message
        : 'Failed to upload question paper. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Upload error:', err.response || err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Upload Question Paper
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Share your question papers with the community. All uploads are subject to admin review and approval.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Paper Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Data Structures Midterm Exam"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Computer Science, Mathematics, Physics"
              required
            />
          </div>

          {/* Exam Name */}
          <div>
            <label htmlFor="examName" className="block text-sm font-medium text-gray-700">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="examName"
              name="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., GATE 2023, End-Semester Exam"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 2023"
              min="1900" // Sensible minimum year
              max={new Date().getFullYear() + 5} // Allow a few years into the future
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Provide a brief description of the paper content."
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (Optional, comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., algorithms, data structures, exam prep"
            />
          </div>

          {/* File Input */}
          <div>
            <label htmlFor="questionPaperFile" className="block text-sm font-medium text-gray-700">
              Select Question Paper File (PDF, DOC, DOCX) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="questionPaperFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="questionPaperFile"
                      name="questionPaperFile"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx" // Restrict file types in browser
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedFile ? selectedFile.name : 'PDF, DOCX, DOC up to 10MB'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={uploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                uploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionPaperUpload;