//
//  ClosetItemModels.swift
//  Worn
//
//  Created by Christopher Gu on 1/22/24.
//

struct Brand: Identifiable, Decodable, Equatable {
    let id: Int
    let name: String
}

struct Category: Identifiable, Decodable, Equatable {
    let id: Int
    let name: String
}

struct Size: Identifiable, Decodable, Equatable {
    let id: Int
    let name: String
}

struct CustomColor: Identifiable, Decodable, Equatable {
    let id: Int
    let name: String
    let hex: String
}

struct Material: Identifiable, Decodable, Equatable, Hashable {
    let id: Int
    let name: String
}

struct UserInputMaterial: Identifiable, Equatable {
    let id: Int
    var name: String
    var percentage: Int
}

struct Country: Identifiable, Decodable, Equatable {
    let id: Int
    let name: String
    let code: String
}
