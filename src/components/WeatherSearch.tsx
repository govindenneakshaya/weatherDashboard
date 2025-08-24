import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import type { SearchLocation } from '../types/weather';

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  onLocationSearch: (query: string) => Promise<SearchLocation[]>;
  recentSearches: string[];
  loading: boolean;
}

const WeatherSearch = ({
  onSearch,
  onLocationSearch,
  recentSearches,
  loading,
}: WeatherSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length >= 2) {
        const results = await onLocationSearch(query);
        setSuggestions(results);
        setShowSuggestions(true);
        setShowRecent(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onLocationSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setShowRecent(false);
    }
  };

  const handleSuggestionClick = (location: SearchLocation) => {
    const cityName = `${location.name}, ${location.country}`;
    setQuery(cityName);
    onSearch(cityName);
    setShowSuggestions(false);
    setShowRecent(false);
  };

  const handleRecentClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setShowRecent(false);
  };

  const handleInputFocus = () => {
    if (query.length < 2 && recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {(showSuggestions || showRecent) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-64 overflow-y-auto z-50"
        >
          {showSuggestions && suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Suggestions
              </div>
              {suggestions.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSuggestionClick(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {location.region}, {location.country}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {showRecent && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Recent Searches
              </div>
              {recentSearches.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-900 truncate">{city}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;