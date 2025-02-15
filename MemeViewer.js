import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";

// Categories for memes
const MEME_CATEGORIES = [
  { id: "funny", name: "Funny", icon: "😂", subreddit: "memes" },
  { id: "cats", name: "Cats", icon: "😺", subreddit: "Catmemes" },
  { id: "dogs", name: "Dogs", icon: "🐕", subreddit: "dogmemes" },
  { id: "work", name: "Work Life", icon: "💼", subreddit: "workchronicles" },
  { id: "coding", name: "Coding", icon: "💻", subreddit: "ProgrammerHumor" },
  { id: "gaming", name: "Gaming", icon: "🎮", subreddit: "gamingmemes" },
];

const MemeCard = ({ meme, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-[100px] h-[120px]"
  >
    <div className="relative w-full h-[80px]">
      <img
        src={meme.url}
        alt={meme.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="p-1 text-center">
      <h3 className="text-xs font-medium text-gray-900 truncate">
        {meme.title}
      </h3>
      <p className="text-xs text-gray-500">👍 {meme.ups.toLocaleString()}</p>
    </div>
  </div>
);

const MemeModal = ({ meme, onClose }) => {
  if (!meme) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="p-4">
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full h-auto rounded-lg"
          />
          <div className="mt-2">
            <h3 className="text-base font-bold text-gray-900">{meme.title}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-600">
                👍 {meme.ups.toLocaleString()}
              </p>
              <a
                href={`https://reddit.com${meme.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                View on Reddit
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingGrid = () => (
  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1">
    {Array(15)
      .fill()
      .map((_, i) => (
        <div key={i} className="animate-pulse w-[100px] h-[120px]">
          <div className="bg-gray-200 aspect-video rounded-sm"></div>
          <div className="mt-1 h-2 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-1 h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
  </div>
);

const MemeBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    MEME_CATEGORIES[0].id
  );
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemes = async (categoryId) => {
    const category = MEME_CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.reddit.com/r/${category.subreddit}/hot.json?limit=100`
      );

      if (!response.ok) throw new Error("Failed to fetch memes");

      const data = await response.json();

      const filteredMemes = data.data.children
        .map((post) => post.data)
        .filter((post) => {
          const isImage = post.url?.match(/\.(jpg|jpeg|png|gif)$/);
          return isImage && !post.over_18;
        })
        .map((post) => ({
          id: post.id,
          title: post.title,
          url: post.url,
          ups: post.ups,
          permalink: post.permalink,
        }));

      setMemes(filteredMemes.slice(0, 50));
    } catch (err) {
      setError("Failed to load memes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-2">
          <h1 className="text-xl font-bold py-2 text-gray-900">Meme Browser</h1>
        </div>
      </header>

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-2">
          <div className="flex gap-1 overflow-x-auto py-1">
            {MEME_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 py-1 rounded-full whitespace-nowrap text-xs transition-colors
                  ${
                    selectedCategory === category.id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-2 py-2">
        {isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2 text-sm">{error}</p>
            <button
              onClick={() => fetchMemes(selectedCategory)}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1">
            {memes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                onClick={() => setSelectedMeme(meme)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedMeme && (
        <MemeModal meme={selectedMeme} onClose={() => setSelectedMeme(null)} />
      )}
    </div>
  );
};

export default MemeBrowser;
