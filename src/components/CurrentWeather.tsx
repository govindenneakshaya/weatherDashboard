import { Droplets, Wind, Eye, Sun } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'C' | 'F';
}

const CurrentWeather = ({ weather, unit }: CurrentWeatherProps) => {
  const temp = unit === 'C' ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike = unit === 'C' ? weather.current.feelslike_c : weather.current.feelslike_f;
  const windSpeed = unit === 'C' ? weather.current.wind_kph : weather.current.wind_mph;
  const windUnit = unit === 'C' ? 'km/h' : 'mph';

  const getBackgroundClass = (conditionCode: number) => {
    if (conditionCode === 1000) return 'from-blue-400 to-blue-600'; // Sunny
    if ([1003, 1006, 1009].includes(conditionCode)) return 'from-gray-400 to-gray-600'; // Cloudy
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201].includes(conditionCode)) return 'from-blue-500 to-indigo-600'; // Rainy
    if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282].includes(conditionCode)) return 'from-blue-200 to-blue-400'; // Snowy
    return 'from-blue-400 to-purple-600'; // Default
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundClass(weather.current.condition.code)} rounded-2xl p-8 text-white shadow-xl`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {weather.location.name}
          </h2>
          <p className="text-white/80 text-lg">
            {weather.location.region}, {weather.location.country}
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-light mb-2">
            {Math.round(temp)}°{unit}
          </div>
          <p className="text-white/80 text-sm">
            Feels like {Math.round(feelsLike)}°{unit}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <img
          src={`https:${weather.current.condition.icon}`}
          alt={weather.current.condition.text}
          className="w-16 h-16"
        />
        <div>
          <h3 className="text-xl font-semibold">
            {weather.current.condition.text}
          </h3>
          <p className="text-white/80">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Humidity</span>
          </div>
          <div className="text-2xl font-semibold">{weather.current.humidity}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Wind</span>
          </div>
          <div className="text-2xl font-semibold">{Math.round(windSpeed)} {windUnit}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Visibility</span>
          </div>
          <div className="text-2xl font-semibold">{weather.current.vis_km} km</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">UV Index</span>
          </div>
          <div className="text-2xl font-semibold">{weather.current.uv}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;