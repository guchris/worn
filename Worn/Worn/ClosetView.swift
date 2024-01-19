//
//  ClosetView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI
import SwiftData
import PhotosUI

struct ClosetView: View {
    @Environment(\.modelContext) var context
    @State private var searchText = ""
    @State private var isShowingClosetItemSheet = false
    @Query(sort: \ClosetItem.name) var closetItems: [ClosetItem] = []
    
    var body: some View {
        NavigationStack {
            ScrollView {
            }
            .navigationTitle("My Items")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Search")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        isShowingClosetItemSheet = true
                    } label: { Image(systemName: "plus.circle") }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {} label: { Image(systemName: "line.3.horizontal.decrease.circle") }
                }
            }
        }
    }
}

#Preview {
    ClosetView()
}
