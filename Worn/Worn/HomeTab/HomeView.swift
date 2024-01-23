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
                WeatherContainerView()
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
        }
    }
}

#Preview {
    HomeView()
}
