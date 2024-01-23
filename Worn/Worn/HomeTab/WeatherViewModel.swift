//
//  WeatherViewModel.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import Combine
import Foundation

class WeatherViewModel: ObservableObject {
    @Published var weatherData: WeatherData?
    @Published var forecastData: ForecastData?

    private var cancellables: Set<AnyCancellable> = []

    init() {
        fetchWeatherData()
    }

    func fetchWeatherData() {
        let apiKey = "502a0e37e7614282b4b191417242301"
        let city = "Seattle"

        guard let url = URL(string: "https://api.weatherapi.com/v1/current.json?key=\(apiKey)&q=\(city)") else {
            return
        }

        URLSession.shared.dataTaskPublisher(for: url)
            .map(\.data)
            .tryMap { data -> Data in
                print("Received raw JSON data: \(String(data: data, encoding: .utf8) ?? "")")
                return data
            }
            .decode(type: WeatherData.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                    case .finished:
                        print("API request completed.")
                    case .failure(let error):
                        print("Error: \(error)")
                }
            }) { [weak self] data in
                self?.weatherData = data
                print("Received weather data: \(data)")
            }
            .store(in: &cancellables)
    }
    
    func fetchForecastData() {
        let apiKey = "502a0e37e7614282b4b191417242301"
        let city = "Seattle"

        guard let url = URL(string: "https://api.weatherapi.com/v1/forecast.json?key=\(apiKey)&q=\(city)&days=1") else {
            return
        }

        URLSession.shared.dataTaskPublisher(for: url)
            .map(\.data)
            .tryMap { data -> Data in
                print("Received raw forecast JSON data: \(String(data: data, encoding: .utf8) ?? "")")
                return data
            }
            .decode(type: ForecastData.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    print("Forecast API request completed.")
                case .failure(let error):
                    print("Error decoding forecast data: \(error)")
                    if let decodingError = error as? DecodingError {
                        switch decodingError {
                        case .dataCorrupted(let context):
                            print("Data Corrupted: \(context)")
                        case .keyNotFound(let key, let context):
                            print("Key Not Found: \(key), \(context)")
                        case .typeMismatch(let type, let context):
                            print("Type Mismatch: \(type), \(context)")
                        case .valueNotFound(let type, let context):
                            print("Value Not Found: \(type), \(context)")
                        @unknown default:
                            print("Unknown Decoding Error")
                        }
                    }
                }
            }) { [weak self] data in
                self?.forecastData = data
                print("Received forecast data: \(data)")
            }
            .store(in: &cancellables)
    }
}
