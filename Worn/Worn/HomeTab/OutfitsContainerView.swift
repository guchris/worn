//
//  OutfitsContainerView.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import SwiftUI

struct OutfitsContainerView: View {
    let currentDate = Calendar.current.component(.day, from: Date())
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            Text("Outfits")
                .font(.headline)
                .fontWeight(.bold)
            
            VStack(alignment: .leading) {
                Text("Last 7 days")
                    .font(.headline)
                
//                HStack {
//                    ForEach((7..<14).reversed(), id: \.self) { offset in
//                        let number = currentDate - offset
//                        RoundedRectangleView(number: number, isWhite: false)
//                            .frame(maxWidth: .infinity)
//                    }
//                }
                
                HStack {
                    ForEach((0..<7).reversed(), id: \.self) { offset in
                        let number = currentDate - offset
                        RoundedRectangleView(number: number, isWhite: false)
                            .frame(maxWidth: .infinity)
                    }
                }
                
                HStack {
                    Button(action: {
                        // Action for Add Outfit button
                    }) {
                        Text("Add Outfit")
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button(action: {
                        // Action for View All Outfits button
                    }) {
                        Text("View All Outfits")
                    }
                    .buttonStyle(.bordered)
                    
                    Spacer()
                }
            }
            .padding(16)
            .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
            }
    }
}

struct RoundedRectangleView: View {
    let number: Int
    let isWhite: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(isWhite ? Color.white : Color.gray)
                .frame(height: 50)
            Text("\(number)")
                .foregroundColor(isWhite ? Color.gray : Color.white)
                .bold()
        }
    }
}

#Preview {
    OutfitsContainerView()
}
