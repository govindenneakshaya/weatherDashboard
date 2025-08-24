import { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import WeatherSearch from './WeatherSearch';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import UnitToggle from './UnitToggle';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const WeatherDashboard = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    recentSearches,
    searchWeather,
    searchLocations,
  } = useWeather();
  
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  // Load default location on component mount
  useEffect(() => {
    searchWeather('London');
  }, [searchWeather]);

  const handleSearch = (city: string) => {
    searchWeather(city);
  };

  const handleRetry = () => {
    if (recentSearches.length > 0) {
      searchWeather(recentSearches[0]);
    } else {
      searchWeather('London');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Weather Dashboard</h1>
                <p className="text-sm text-gray-600">Get current weather and forecasts</p>
              </div>
            </div>
            <UnitToggle unit={unit} onToggle={setUnit} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <WeatherSearch
            onSearch={handleSearch}
            onLocationSearch={searchLocations}
            recentSearches={recentSearches}
            loading={loading}
          />
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {!loading && !error && currentWeather && (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeather weather={currentWeather} unit={unit} />

            {/* 5-Day Forecast */}
            {forecast && (
              <WeatherForecast forecast={forecast} unit={unit} />
            )}
          </div>
        )}

        {!loading && !error && !currentWeather && (
          <div className="text-center py-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Weather Dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Search for a city to get started with weather information
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Weather data provided by{' '}
              <a
                href="https://www.weatherapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                WeatherAPI.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeatherDashboard;