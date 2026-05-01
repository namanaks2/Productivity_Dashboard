import React, { useState, useEffect } from 'react';
import { CloudRain, Cloud, Sun, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets, Thermometer, MapPin, RefreshCw, Loader2 } from 'lucide-react';

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: Sun, color: '#fbbf24' },
  1: { label: 'Mainly Clear', icon: Sun, color: '#fbbf24' },
  2: { label: 'Partly Cloudy', icon: Cloud, color: '#94a3b8' },
  3: { label: 'Overcast', icon: Cloud, color: '#64748b' },
  45: { label: 'Fog', icon: Cloud, color: '#94a3b8' },
  48: { label: 'Rime Fog', icon: Cloud, color: '#94a3b8' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, color: '#60a5fa' },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle, color: '#3b82f6' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, color: '#2563eb' },
  61: { label: 'Slight Rain', icon: CloudRain, color: '#60a5fa' },
  63: { label: 'Moderate Rain', icon: CloudRain, color: '#3b82f6' },
  65: { label: 'Heavy Rain', icon: CloudRain, color: '#2563eb' },
  71: { label: 'Slight Snow', icon: CloudSnow, color: '#e2e8f0' },
  73: { label: 'Moderate Snow', icon: CloudSnow, color: '#cbd5e1' },
  75: { label: 'Heavy Snow', icon: CloudSnow, color: '#94a3b8' },
  80: { label: 'Rain Showers', icon: CloudRain, color: '#60a5fa' },
  81: { label: 'Moderate Showers', icon: CloudRain, color: '#3b82f6' },
  82: { label: 'Violent Showers', icon: CloudRain, color: '#2563eb' },
  95: { label: 'Thunderstorm', icon: CloudLightning, color: '#f59e0b' },
  96: { label: 'Thunderstorm + Hail', icon: CloudLightning, color: '#f59e0b' },
  99: { label: 'Heavy Thunderstorm', icon: CloudLightning, color: '#ef4444' },
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&temperature_unit=celsius&wind_speed_unit=kmh`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
      });
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
        const geoData = await geoRes.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || '';
        const state = geoData.address?.state || '';
        setLocationName(city ? `${city}${state ? ', ' + state : ''}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      } catch {
        setLocationName(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => { fetchWeather(28.6139, 77.2090); setLocationName('New Delhi, India'); }
      );
    } else {
      fetchWeather(28.6139, 77.2090);
      setLocationName('New Delhi, India');
    }
  };

  useEffect(() => { getLocation(); }, []);

  const weatherInfo = weather ? (WMO_CODES[weather.weatherCode] || WMO_CODES[0]) : WMO_CODES[0];
  const WeatherIcon = weatherInfo.icon;

  return (
    <div className="weather-widget glass-panel">
      {loading ? (
        <div className="weather-loading">
          <Loader2 size={32} />
          <p>Fetching weather...</p>
        </div>
      ) : error ? (
        <div className="weather-error">
          <p>Could not load weather</p>
          <button className="btn btn-sm" onClick={getLocation}>Retry</button>
        </div>
      ) : (
        <>
          <div className="weather-main">
            <div className="weather-icon-container">
              <WeatherIcon size={48} color={weatherInfo.color} />
            </div>
            <div className="weather-temp">
              <h2>{weather.temp}°C</h2>
              <p>{weatherInfo.label}</p>
            </div>
            <button className="weather-refresh" onClick={getLocation} title="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="weather-location">
            <MapPin size={14} /> {locationName}
          </div>
          <div className="weather-details">
            <div className="weather-detail-item"><Thermometer size={16} /><span>Feels {weather.feelsLike}°</span></div>
            <div className="weather-detail-item"><Wind size={16} /><span>{weather.windSpeed} km/h</span></div>
            <div className="weather-detail-item"><Droplets size={16} /><span>{weather.humidity}%</span></div>
          </div>
        </>
      )}
      <style>{`
        .weather-widget {
          padding: 24px; height: 100%; display: flex; flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #f0f4ff 0%, #e8ecfa 50%, #f5f0ff 100%);
          border: 1px solid rgba(99, 102, 241, 0.08);
        }
        .weather-loading, .weather-error {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px; color: var(--text-muted);
        }
        .weather-main { display: flex; align-items: center; gap: 16px; }
        .weather-temp h2 { font-size: 42px; font-weight: 700; line-height: 1; margin-bottom: 4px; color: var(--text-primary); }
        .weather-temp p { color: var(--text-secondary); font-size: 15px; font-weight: 500; }
        .weather-refresh {
          margin-left: auto; background: rgba(255, 255, 255, 0.6); border: 1px solid var(--border-color);
          color: var(--text-muted); padding: 8px; border-radius: 8px; cursor: pointer; display: flex;
        }
        .weather-refresh:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .weather-location {
          font-size: 15px; font-weight: 600; color: var(--text-primary);
          margin: 16px 0; display: flex; align-items: center; gap: 6px;
        }
        .weather-details { display: flex; gap: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .weather-detail-item {
          display: flex; align-items: center; gap: 6px;
          color: var(--text-secondary); font-size: 14px; font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
