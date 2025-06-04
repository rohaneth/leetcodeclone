import { TagContainer } from "./Tag";
import { useNavigate } from "react-router-dom";

interface ProblemType {
  id: string;
  problemName: string;
  tags: string[];
}

export const ProblemList = ({
  problemList,
}: {
  problemList: ProblemType[];
}) => {
  const navigate = useNavigate();

  const handleProblemClick = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">All Problems</h1>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 bg-gray-700 px-4 py-3 text-gray-300 uppercase text-sm font-semibold">
            <div className="col-span-1">Id</div>
            <div className="col-span-3">Problem Name</div>
            <div className="col-span-2 text-right">Recently Solved</div>
          </div>

          {/* Rows */}
          {problemList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProblemClick(item.id)}
              className="grid grid-cols-6 gap-4 items-center border-b border-gray-700 hover:bg-gray-700 px-4 py-4 cursor-pointer transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleProblemClick(item.id)}
            >
              <div className="col-span-1 font-medium text-lg">{item.id}</div>
              <div className="col-span-3">
                <div className="text-lg font-semibold hover:underline">{item.problemName}</div>
                <TagContainer tags={item.tags} darkMode />
              </div>
              <div className="col-span-2 text-right text-gray-400">
                <span className="text-gray-500">Last submission: </span>
                <span className="font-medium">Anirudh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};