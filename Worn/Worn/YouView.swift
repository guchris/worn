//
//  YouView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI

struct YouView: View {
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            ScrollView {
                
            }
            .navigationTitle("You")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Search")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {} label: { Image(systemName: "person.crop.circle.fill") }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {} label: { Image(systemName: "gearshape") }
                }
            }
        }
    }
}

#Preview {
    YouView()
}
