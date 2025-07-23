/** biome-ignore-all assist/source/organizeImports: <> */
import { useState } from 'react';
import { Lightbulb, Send, Loader2, XCircle } from 'lucide-react';

const App = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('random');
  const [joke, setJoke] = useState(''); // Joke will be displayed in popup
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showJokePopup, setShowJokePopup] = useState(false); // State for popup visibility

  const categories = [
    { value: 'random', label: 'Random Joke' },
    { value: 'Naija Family Vibes', label: 'Naija Family Vibes' },
    { value: 'Lagos Life & Traffic', label: 'Lagos Life & Traffic' },
    { value: 'Before I Blow Struggles', label: '"Before I Blow" Struggles' },
    { value: 'Jollof Rice & Food Fights', label: 'Jollof Rice & Food Fights' },
    { value: 'NEPA/PHCN Palava', label: 'NEPA/PHCN Palava' },
    { value: 'African Time Chronicles', label: '"African Time" Chronicles' },
    { value: 'Online vs. Real Life', label: 'Online vs. Real Life' },
    { value: 'School Days & Exams', label: 'School Days & Exams' },
    { value: 'Shopping & Market Runs', label: 'Shopping & Market Runs' },
    { value: 'Social Media Shenanigans', label: 'Social Media Shenanigans' },
  ];

  const API = import.meta.env.VITE_API;

  const handleGenerateJoke = async () => {
    setJoke(''); // Clear previous joke
    setErrorMessage('');
    setIsLoading(true);
    setShowJokePopup(false); // Hide popup while generating

    const payload = {};
    if (content.trim()) payload.content = content.trim();
    else if (category.trim()) payload.category = category.trim();

    if (!payload.content && !payload.category) {
      setErrorMessage(
        'Please provide content or select a category to generate a joke.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/joke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setJoke(data.message);
        setShowJokePopup(true); // Show popup on success
      } else {
        setErrorMessage(
          data.message || 'An error occurred while fetching the joke.'
        );
      }
    } catch (error) {
      console.error('Error generating joke:', error);
      setErrorMessage('Network error or server unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeJokePopup = () => {
    setShowJokePopup(false);
    setJoke(''); // Clear joke when closing
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-auto p-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-inter">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-lg transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-4 flex items-center justify-center gap-3">
          <Lightbulb className="text-yellow-500 w-8 h-8 sm:w-9 sm:h-9" />
          Nigerian Jokes
        </h1>

        <p className="text-center text-gray-600 mb-8 text-base sm:text-lg">
          Get ready for some witty, sarcastic, and relatable Nigerian humor!
        </p>

        <div className="space-y-6 mb-8">
          <div>
            <label
              htmlFor="contentInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What do you want a joke about (optional):
            </label>
            <input
              id="contentInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
              placeholder="E.g., 'joke about exam stress' or 'funny market experience'"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm italic px-3 bg-white rounded-full">
              OR
            </span>
          </div>

          <div>
            <label
              htmlFor="categorySelect"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose a category:
            </label>
            <select
              id="categorySelect"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleGenerateJoke}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate Joke
            </>
          )}
        </button>

        {errorMessage && (
          <p className="text-red-600 text-sm mt-3 text-center font-medium">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Joke Popup Card */}
      {showJokePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-lg relative">
            <button
              type="button"
              onClick={closeJokePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close joke"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Here's Your Joke!
            </h3>
            <div className="min-h-[100px] bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-center text-center text-gray-700 italic text-lg leading-relaxed shadow-inner">
              <p>{joke}</p>
            </div>
            <button
              type="button"
              onClick={closeJokePopup}
              className="mt-6 w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
