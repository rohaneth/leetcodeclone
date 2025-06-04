import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProblemType {
  id: string;
  problemName: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

interface TestCaseResult {
  input: { nums: number[]; target: number };
  expected: number[];
  output: number[];
  passed: boolean;
  error?: string; // To store error messages if any
}

interface SubmissionResult {
  status: 'success' | 'error' | null;
  message: string;
  testCases?: TestCaseResult[];
}

export const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [code, setCode] = useState(`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`);

  // Function to safely execute user code
  const executeUserCode = (code: string, testCase: { nums: number[]; target: number }): { result: number[] | null; error: Error | null } => {
    try {
      // Create a function from the user's code
      const func = new Function('nums', 'target',
        `${code}\nreturn twoSum(nums, target);`
      );

      // Execute the function with test case input
      const result = func(testCase.nums, testCase.target);
      return { result, error: null };
    } catch (error) {
      return { result: null, error: error as Error };
    }
  };

  // Mock function to simulate API call - replace with actual API call
  const mockSubmitSolution = async (data: {
    problemId: string;
    language: string;
    code: string;
  }): Promise<{ message: string; testCases: TestCaseResult[] }> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Define test cases
        const testCaseInputs = [
          { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
          { nums: [3, 2, 4], target: 6, expected: [1, 2] },
          { nums: [3, 3], target: 6, expected: [0, 1] },
          { nums: [1, 2, 3, 4, 5], target: 9, expected: [3, 4] },
          { nums: [0, 4, 3, 0], target: 0, expected: [0, 3] }
        ];

        const testCases: TestCaseResult[] = [];
        let allPassed = true;
        let hasError = false;

        // Test each case
        for (const testCase of testCaseInputs) {
          const { result, error } = executeUserCode(data.code, testCase);

          if (error) {
            testCases.push({
              input: { nums: testCase.nums, target: testCase.target },
              expected: testCase.expected,
              output: [], // Empty array for error case to maintain type safety
              passed: false,
              error: error.message
            });
            allPassed = false;
            hasError = true;
            break;
          }

          // Check if result is valid and matches expected output (order doesn't matter for this problem)
          let isPassed = false;
          if (result && Array.isArray(result) && result.length === 2) {
            isPassed = (result[0] === testCase.expected[0] && result[1] === testCase.expected[1]) ||
              (result[0] === testCase.expected[1] && result[1] === testCase.expected[0]);
          }

          testCases.push({
            input: { nums: testCase.nums, target: testCase.target },
            expected: testCase.expected,
            output: result || [],
            passed: isPassed,
            error: !result ? 'No result returned from function' : undefined
          });

          if (!isPassed) {
            allPassed = false;
          }
        }

        resolve({
          message: hasError
            ? 'Runtime Error in your code'
            : allPassed
              ? 'All test cases passed! 🎉'
              : 'Some test cases failed',
          testCases
        });
      }, 1500); // Simulate network delay
    });
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting!');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await mockSubmitSolution({
        problemId: problemId || '',
        language: selectedLanguage,
        code
      });

      setSubmissionResult({
        status: 'success',
        message: response.message,
        testCases: response.testCases
      });

      toast.success('Solution submitted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit solution';
      setSubmissionResult({
        status: 'error',
        message: errorMessage
      });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For now, we'll use mock data. In a real app, you'd fetch this from your backend
  const problem: ProblemType = {
    id: problemId || '1',
    problemName: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table']
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-100">{problem.problemName}</h1>
      <div className="flex items-center gap-4 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          problem.difficulty === 'Easy' ? 'bg-green-800 text-green-200' :
            problem.difficulty === 'Medium' ? 'bg-yellow-800 text-yellow-200' :
              'bg-red-800 text-red-200'
        }`}>
          {problem.difficulty}
        </span>
        <div className="flex gap-2">
          {problem.tags.map((tag, index) => (
            <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Description</h2>
        <p className="whitespace-pre-line mb-6 text-gray-200">{problem.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-100">Example 1:</h3>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-200"><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
            <p className="text-gray-200"><strong>Output:</strong> [0,1]</p>
            <p className="text-gray-200"><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-100">Constraints:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-200"><code>2 ≤ nums.length ≤ 10<sup>4</sup></code></li>
            <li className="text-gray-200"><code>-10<sup>9</sup> ≤ nums[i] ≤ -10<sup>9</sup></code></li>
            <li className="text-gray-200"><code>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></code></li>
            <li className="text-gray-200">Only one valid answer exists.</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Solution</h2>
        <div className="mb-4">
          <select
            className="bg-gray-700 border border-gray-600 rounded p-2 w-48 mb-4 text-gray-200"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option className="bg-gray-700 text-gray-200" value="JavaScript">JavaScript</option>
            <option className="bg-gray-700 text-gray-200" value="Python">Python</option>
            <option className="bg-gray-700 text-gray-200" value="Java">Java</option>
            <option className="bg-gray-700 text-gray-200" value="C++">C++</option>
          </select>
        </div>
        <textarea
          className="w-full border border-gray-600 rounded-md p-4 bg-gray-700 text-gray-100 font-mono text-sm h-64 overflow-auto"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
        <div className="mt-4 space-y-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : 'Submit'}
          </button>

          {submissionResult && (
            <div className={`p-4 rounded-md ${
              submissionResult.status === 'success'
                ? submissionResult.message.includes('failed')
                  ? 'bg-yellow-900 border-l-4 border-yellow-600'
                  : 'bg-green-900 border-l-4 border-green-600'
                : 'bg-red-900 border-l-4 border-red-600'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {submissionResult.status === 'success' ? (
                    submissionResult.message.includes('failed') ? (
                      <svg className="h-5 w-5 text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )
                  ) : (
                    <svg className="h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    submissionResult.status === 'success'
                      ? submissionResult.message.includes('failed')
                        ? 'text-yellow-300'
                        : 'text-green-300'
                      : 'text-red-300'
                  }`}>
                    {submissionResult.message}
                  </p>
                </div>
              </div>

              {submissionResult.testCases && submissionResult.testCases.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 text-gray-100">Test Results:</h4>
                  <div className="space-y-2">
                    {submissionResult.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className={`p-2 text-sm rounded ${
                          testCase.passed
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-mono mr-2 text-gray-100">
                            Test Case {index + 1}:
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            testCase.passed
                              ? 'bg-green-800 text-green-200'
                              : 'bg-red-800 text-red-200'
                          }`}>
                            {testCase.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        {!testCase.passed && (
                          <div className="mt-1 text-xs space-y-1">
                            <div className="text-gray-200">Input: <code className="bg-gray-700 px-1 rounded">{JSON.stringify(testCase.input)}</code></div>
                            <div className="text-gray-200">Expected: <code className="bg-gray-700 px-1 rounded">{JSON.stringify(testCase.expected)}</code></div>
                            <div className="text-gray-200">Output: <code className="bg-gray-700 px-1 rounded">{JSON.stringify(testCase.output)}</code></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
