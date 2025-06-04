import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-gray-200 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-5xl font-bold text-yellow-400 underline decoration-yellow-500 mb-8">
          Daily Code
        </h1>
  
        <div className="max-w-2xl text-center space-y-6">
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Welcome to <span className="text-yellow-300 font-semibold">Daily Code</span> — your go-to platform for sharpening coding skills and engaging with a dedicated developer community.
            We deliver real-world coding challenges with a smooth, distraction-free experience.
          </p>
  
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Whether you're a beginner or a seasoned pro, every challenge is crafted to help you grow. Code with purpose. Learn by doing. Grow every day.
          </p>
  
          <blockquote className="italic text-gray-400 border-l-4 border-yellow-500 pl-4">
            "If code isn't a daily adventure, then what is?" – Daily Code Platform
          </blockquote>
  
          <div className="bg-yellow-900/20 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg shadow mt-4">
            <strong>Note for Recruiters:</strong> Inline solutions are included for quicker testing and review.
          </div>
  
          <div className="pt-8">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-medium px-6 py-2 rounded-full shadow-md transition duration-200" onClick={() => navigate('/problems')}>
              View Problems
            </button>
          </div>
        </div>
      </div>
    );
  };
  