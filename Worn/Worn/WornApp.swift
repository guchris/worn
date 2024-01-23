//
//  WornApp.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI
import SwiftData

@main
struct WornApp: App {

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Item.self)
    }
}
