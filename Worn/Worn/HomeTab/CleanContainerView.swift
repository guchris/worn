//
//  CleanContainerView.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import SwiftUI

struct CleanContainerView: View {
    let mockClothingImages = ["item1", "item2", "item3", "item4"]
    
    @State private var currentIndex = 0
    @State private var offset: CGSize = .zero
    @State private var gestureTranslation: CGFloat = 0
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            Text("Marie Kondo")
                .font(.headline)
                .fontWeight(.bold)
            
            VStack(alignment: .leading, spacing: 16) {
                CardStack(cards: mockClothingImages, currentIndex: $currentIndex) { imageName in
                    CleanCardView(imageName: imageName)
                        .rotationEffect(.degrees(Double(gestureTranslation / 5)))
                        .offset(x: offset.width, y: offset.height)
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    gestureTranslation = value.translation.width
                                    offset = value.translation
                                }
                                .onEnded { value in
                                    withAnimation {
                                        handleSwipe(translation: value.translation.width)
                                    }
                                    gestureTranslation = 0
                                    offset = .zero
                                }
                        )
                }
                
                HStack {
                    Button(action: {
                        rotateImages()
                    }) {
                        Text("Discard")
                            .foregroundColor(.white)
                            .padding(8)
                            .background(gestureTranslation < 0 ? Color.red : Color.gray.opacity(0.5))
                            .cornerRadius(8)
                    }
                    
                    Spacer()
                    
                    Button(action: {
                        rotateImages()
                    }) {
                        Text("Keep")
                            .foregroundColor(.white)
                            .padding(8)
                            .background(gestureTranslation > 0 ? Color.green : Color.gray.opacity(0.5))
                            .cornerRadius(8)
                    }
                }
            }
            .padding(16)
            .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
        }
    }
    
    private func rotateImages() {
        currentIndex = (currentIndex + 1) % mockClothingImages.count
    }
    
    private func handleSwipe(translation: CGFloat) {
        if translation > 0 {
            // Swipe right (Keep)
            rotateImages()
        } else {
            // Swipe left (Discard)
            rotateImages()
        }
    }
}

struct CleanCardView: View {
    let imageName: String
    
    var body: some View {
        Image(imageName)
            .resizable()
            .scaledToFit()
            .cornerRadius(12)
    }
}

struct CardStack<Content: View, T: Identifiable>: View {
    var cards: [T]
    @Binding var currentIndex: Int
    var cardContent: (T) -> Content
    
    var body: some View {
        ZStack {
            ForEach(cards.indices, id: \.self) { index in
                cardContent(cards[index])
                    .zIndex(Double(index))
                    .opacity(index == currentIndex ? 1 : 0)
            }
        }
    }
}

// Extend String to conform to Identifiable
extension String: Identifiable {
    public var id: String { self }
}

#Preview {
    CleanContainerView()
}
