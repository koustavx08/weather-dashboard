export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ForecastData {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
  }
  hourly: Array<{
    dt: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    pop: number
  }>
  daily: Array<{
    dt: number
    sunrise: number
    sunset: number
    moonrise?: number
    moonset?: number
    moon_phase?: number
    temp: {
      day: number
      min: number
      max: number
      night: number
      eve: number
      morn: number
    }
    feels_like: {
      day: number
      night: number
      eve: number
      morn: number
    }
    pressure: number
    humidity: number
    dew_point?: number
    wind_speed: number
    wind_deg: number
    wind_gust?: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    clouds: number
    pop: number
    rain?: number
    uvi: number
  }>
}

export interface WeatherInsight {
  type: string
  recommendation: string
}

export interface WeatherAlert {
  type: string
  severity: "mild" | "moderate" | "severe" | "extreme"
  message: string
}
