//
//  HomeView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
            }
            .navigationTitle("Home")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {} label: { Image(systemName: "plus.circle") }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {} label: { Image(systemName: "bell") }
                }
            }
        }
    }
}

#Preview {
    HomeView()
}
