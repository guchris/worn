//
//  ContentView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    @State private var selectedTab = 0
//    @Environment(\.modelContext) private var modelContext
//    @Query private var items: [Item]

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house")
                    Text("Home")
                }
            
            ExploreView()
                .tabItem {
                    Image(systemName: "safari")
                    Text("Explore")
                }
            
            ClosetView()
                .tabItem {
                    Image(systemName: "door.sliding.left.hand.closed")
                    Text("Closet")
                }
            
            YouView()
                .tabItem {
                    Image(systemName: "person.crop.circle")
                    Text("You")
                }
        }
        
        
//        NavigationSplitView {
//            List {
//                ForEach(items) { item in
//                    NavigationLink {
//                        Text("Item at \(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))")
//                    } label: {
//                        Text(item.timestamp, format: Date.FormatStyle(date: .numeric, time: .standard))
//                    }
//                }
//                .onDelete(perform: deleteItems)
//            }
//            .toolbar {
//                ToolbarItem(placement: .navigationBarTrailing) {
//                    EditButton()
//                }
//                ToolbarItem {
//                    Button(action: addItem) {
//                        Label("Add Item", systemImage: "plus")
//                    }
//                }
//            }
//        } detail: {
//            Text("Select an item")
//        }
    }

//    private func addItem() {
//        withAnimation {
//            let newItem = Item(timestamp: Date())
//            modelContext.insert(newItem)
//        }
//    }
//
//    private func deleteItems(offsets: IndexSet) {
//        withAnimation {
//            for index in offsets {
//                modelContext.delete(items[index])
//            }
//        }
//    }
}

#Preview {
    ContentView()
//        .modelContainer(for: Item.self, inMemory: true)
}
