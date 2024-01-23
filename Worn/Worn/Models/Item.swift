//
//  ClosetItem.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import Foundation
import SwiftUI
import SwiftData

@Model
final class Item {
    var image: Data
    @Attribute(.unique) var name: String
    var brand: String
    var category: String?
    var size: String?
    var color: String?
    var material: String?
    var madeIn: String?
    var cost: Double?
    var purchaseDate: Date?
    var note: String?
    var createdDate: Date
    
    init(image: Data, name: String, brand: String, category: String? = nil, size: String? = nil, color: String? = nil, material: String? = nil, madeIn: String? = nil, cost: Double? = nil, purchaseDate: Date? = nil, note: String? = nil, createdDate: Date) {
        self.image = image
        self.name = name
        self.brand = brand
        self.category = category
        self.size = size
        self.color = color
        self.material = material
        self.madeIn = madeIn
        self.cost = cost
        self.purchaseDate = purchaseDate
        self.note = note
        self.createdDate = createdDate
    }
}
