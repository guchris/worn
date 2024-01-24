//
//  WeatherContainerView.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import SwiftUI

struct WeatherContainerView: View {
    @ObservedObject var viewModel = WeatherViewModel()
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Weather")
                .font(.headline)
                .fontWeight(.bold)
            HStack {
                VStack(alignment: .leading) {
                    if let weatherData = viewModel.weatherData {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text("Seattle")
                                    .font(.headline)
                                Image(systemName: "location.fill")
                                    .padding(.horizontal, -4)
                                    .font(.system(size: 12))
                                    .bold()
                            }

                            Text("\(Int(weatherData.current?.temp_f ?? 0))°F")
                                .font(.system(size: 32))
                        }

                        VStack(alignment: .leading) {
                            Text(weatherData.current?.condition?.text ?? "[Condition]")
                                .font(.footnote)
                                .foregroundColor(.gray)

                            if let forecast = viewModel.forecastData?.forecast.forecastday.first?.day {
                                Text("H: \(Int(forecast.maxtemp_f))° | L: \(Int(forecast.mintemp_f))°")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            } else {
                                Text("H: [#] ° | L: [#] °")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                    } else {
                        Text("Loading...")
                    }
                }
            }
            .padding(16)
            .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
        }
        .onAppear {
            viewModel.fetchWeatherData()
            viewModel.fetchForecastData()
        }
    }
}


#Preview {
    WeatherContainerView()
}
