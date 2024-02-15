//
//  ImageAnalysis.swift
//  Worn
//
//  Created by Christopher Gu on 2/13/24.
//

import SwiftUI
import PhotosUI

struct ImageAnalysis: View {
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var analysisResult: String = ""
    let apiKey = "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"

    var body: some View {
        VStack {
            if analysisResult.isEmpty {
                PhotosPicker(selection: $selectedPhoto, matching: .images, photoLibrary: .shared()) {
                    Label("Add Image", systemImage: "photo")
                }
            } else {
                Text(analysisResult)
                    .padding()
            }
        }
        .onReceive(selectedPhoto.publisher) { _ in
            if let item = selectedPhoto {
                analyzeImage(item: item)
            }
        }
    }
    
    private func analyzeImage(item: PhotosPickerItem) {
        
        guard let imageData = item.itemProvider?.loadImage(),
              let base64Image = imageData.base64EncodedString(),
              let url = URL(string: "https://api.openai.com/v1/vision/gpt-4/v1/analyze"),
              let jsonData = try? JSONSerialization.data(withJSONObject: ["image": base64Image]),
              let request = try? createRequest(url: url, apiKey: apiKey, jsonData: jsonData) else {
            analysisResult = "Error: Failed to prepare the request."
            return
        }
        
        let session = URLSession.shared
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                analysisResult = "Error: \(error.localizedDescription)"
                return
            }

            guard let httpResponse = response as? HTTPURLResponse else {
                analysisResult = "Error: Invalid response."
                return
            }

            guard (200...299).contains(httpResponse.statusCode) else {
                analysisResult = "Error: HTTP status code \(httpResponse.statusCode)"
                return
            }

            if let data = data,
               let analysis = try? JSONDecoder().decode(AnalysisResponse.self, from: data) {
                DispatchQueue.main.async {
                    self.analysisResult = analysis.result
                }
            } else {
                analysisResult = "Error: Failed to decode analysis response."
            }
        }.resume()
    }
    
    private func createRequest(url: URL, apiKey: String, jsonData: Data) throws -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.httpBody = jsonData
        return request
    }
}

struct AnalysisResponse: Decodable {
    let result: String
}

#Preview {
    ImageAnalysis()
}
