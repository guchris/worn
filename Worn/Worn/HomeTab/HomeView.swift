//
//  HomeView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI
import PhotosUI
import CoreImage
import CoreML
import Vision

struct HomeView: View {
    @State private var isShowingAddImageSheet = false
    @State private var processedImage: UIImage? = nil
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    HStack {
                        WeatherContainerView()
                        Spacer()
                    }
                    OutfitsContainerView()
                    CleanContainerView()
                }
                .padding(24)
            }
            .navigationTitle("Home")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    // Right button with dropdown menu
                    Menu {
                        Button {
                            // Handle "New Item" action
                        } label: {
                            Label("New Item", systemImage: "plus.circle")
                        }

                        Button {
                            // Handle "New Outfit" action
                        } label: {
                            Label("New Outfit", systemImage: "plus.circle")
                        }

                        Button {
                            // Handle "New Collection" action
                        } label: {
                            Label("New Collection", systemImage: "plus.circle")
                        }
                        
                        Button {
                            isShowingAddImageSheet = true
                        } label: {
                            Label("Add Image", systemImage: "plus.circle")
                        }
                    } label: {
                        Image(systemName: "plus.circle")
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink(destination: NotificationsView()) {
                        Image(systemName: "bell")
                    }
                }
            }
            .sheet(isPresented: $isShowingAddImageSheet) {
                AddImageSheet(processedImage: $processedImage)
            }
        }
    }
}

struct AddImageSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var processedImage: UIImage?
    @State private var selectedPhoto: PhotosPickerItem?
    
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    if let photo = selectedPhoto, let uiImage = photo.uiImage {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFit()
                            .cornerRadius(8)
                    }
                    
                    PhotosPicker(selection: $selectedPhoto, matching: .images, photoLibrary: .shared()) {
                        Label("Add Image", systemImage: "photo")
                    }
                    
                    if selectedPhoto != nil {
                        Button("Remove Image", role: .destructive) {
                            selectedPhoto = nil
                            processedImage = nil
                        }
                    }
                }
            }
            .navigationTitle("Add Image")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
            .task(id: selectedPhoto) {
                if let photo = selectedPhoto {
                    if let data = try? await photo.loadTransferable(type: Data.self) {
                        if let inputImage = CIImage(data: data) {
                            if let segmentationMask = performImageSegmentation(inputImage) {
                                let maskedImage = applyMask(inputImage, mask: segmentationMask)
                                processedImage = UIImage(ciImage: maskedImage)
                            }
                        }
                    }
                }
            }
        }
    }
    
    func performImageSegmentation(_ image: CIImage) -> CIImage? {
        // Create DeepLabV3 input
        let modelInput = DeepLabV3Input(image: image.pixelBuffer!)
        
        // Perform prediction using DeepLabV3 model
        do {
            let model = try DeepLabV3(configuration: MLModelConfiguration())
            let prediction = try model.prediction(input: modelInput)
            
            // Retrieve semantic predictions from the model output
            let segmentationMap = prediction.semanticPredictions
            
            // Convert the MLMultiArray to CIImage
            let segmentationImage = CIImage(mlMultiArray: segmentationMap)
            
            // Invert the segmentation map
            let invertedSegmentationImage = segmentationImage.applyingFilter("CIColorInvert")
            
            // Threshold the segmentation map
            let thresholdFilter = CIFilter(name: "CIMaskToAlpha")!
            thresholdFilter.setValue(invertedSegmentationImage, forKey: kCIInputImageKey)
            let thresholdedImage = thresholdFilter.outputImage!
            
            // Dilate the mask to smooth the edges
            let dilateFilter = CIFilter(name: "CIDilateTile")!
            dilateFilter.setValue(thresholdedImage, forKey: kCIInputImageKey)
            let dilatedImage = dilateFilter.outputImage!
            
            // Crop the dilated mask to the size of the input image
            let croppedImage = dilatedImage.cropped(to: image.extent)
            
            // Apply the cropped mask to the input image
            let maskedImage = image.applyingFilter("CIBlendWithMask", parameters: [
                kCIInputMaskImageKey: croppedImage,
                kCIInputBackgroundImageKey: CIImage.black
            ])
            
            return maskedImage
        } catch {
            print("Error performing image segmentation: \(error)")
            return nil
        }
    }


    func applyMask(_ image: CIImage, mask: CIImage) -> CIImage {
        let maskedImage = image.applyingFilter("CIBlendWithMask", parameters: [
            kCIInputMaskImageKey: mask,
            kCIInputBackgroundImageKey: CIImage.black
        ])
        return maskedImage
    }
}


extension CIImage {
    convenience init?(mlMultiArray: MLMultiArray) {
        let size = CGSize(width: mlMultiArray.shape[1].intValue, height: mlMultiArray.shape[0].intValue)
        let bytesPerPixel = 4 // Assuming MLMultiArray is in RGBA format
        let bytesPerComponent = 1
        let bitsPerComponent = 8
        let bytesPerRow = size.width * CGFloat(bytesPerPixel)

        guard let dataPointer = mlMultiArray.dataPointer.bindMemory(to: UInt8.self, capacity: mlMultiArray.count * bytesPerPixel) else {
            return nil
        }

        let provider = CGDataProvider(dataInfo: nil, data: dataPointer, size: mlMultiArray.count * bytesPerPixel * bytesPerComponent, releaseData: { (_, _, _) in })

        guard let cgImage = CGImage(
            width: Int(size.width),
            height: Int(size.height),
            bitsPerComponent: bitsPerComponent,
            bitsPerPixel: bitsPerComponent * bytesPerPixel,
            bytesPerRow: Int(bytesPerRow),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.noneSkipFirst.rawValue),
            provider: provider!,
            decode: nil,
            shouldInterpolate: false,
            intent: .defaultIntent
        ) else {
            return nil
        }

        self.init(cgImage: cgImage)
    }
}

#Preview {
    HomeView()
}
