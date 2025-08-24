import { Droplets } from 'lucide-react';
import type { ForecastData } from '../types/weather';

interface WeatherForecastProps {
  forecast: ForecastData;
  unit: 'C' | 'F';
}

const WeatherForecast = ({ forecast, unit }: WeatherForecastProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.forecast.forecastday.map((day, index) => {
          const maxTemp = unit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f;
          const minTemp = unit === 'C' ? day.day.mintemp_c : day.day.mintemp_f;
          const date = new Date(day.date);
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={day.date}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">{dayName}</div>
                  <div className="text-sm text-gray-500">{fullDate}</div>
                </div>
                
                <div className="flex items-center gap-3 mx-4">
                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="w-10 h-10"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm">
                      {day.day.condition.text}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Droplets className="w-3 h-3" />
                      {day.day.daily_chance_of_rain}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-gray-900">
                    {Math.round(maxTemp)}°
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(minTemp)}°
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;