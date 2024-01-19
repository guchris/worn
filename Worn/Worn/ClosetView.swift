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
//            List {
//                ForEach(closetItems) { closetItem in
//                    ClosetItemCell(closetItem: closetItem)
//                }
//                .onDelete { indexSet in
//                    for index in indexSet {
//                        context.delete(closetItems[index])
//                    }
//                }
//            }
            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 1), count: 3), spacing: 1) {
                    ForEach(closetItems) { closetItem in
                        Image(uiImage: UIImage(data: closetItem.image)!)
                            .resizable()
                            .scaledToFill()
                            .aspectRatio(1.0, contentMode: .fill)
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .frame(height: UIScreen.main.bounds.width / 3)
                            .clipped()
                    }
                }
            }
            .navigationTitle("My Items")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Search")
            .sheet(isPresented: $isShowingClosetItemSheet) { AddClosetItemSheet() }
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
            .overlay {
                if closetItems.isEmpty {
                    ContentUnavailableView(label: {
                        Label("No Items", systemImage: "door.sliding.left.hand.closed")
                    }, description: {
                        Text("Start adding items to see your closet.")
                    })
                }
            }
        }
    }
}

struct ClosetItemCell: View {
    
    let closetItem: ClosetItem
    
    var body: some View {
        HStack {
            Image(uiImage: UIImage(data: closetItem.image)!)
                .resizable()
                .scaledToFill()
                .frame(width: 44, height: 44)
                .cornerRadius(8)
                .clipped()
            VStack (alignment: .leading, content: {
                Text(closetItem.brand)
                Text(closetItem.name)
            })
        }
    }
    
}

struct AddClosetItemSheet: View {
    @Environment(\.modelContext) var context
    @Environment(\.dismiss) private var dismiss
    
    @State private var image: Data = Data()
    @State private var name: String = ""
    @State private var brand: String = ""
    
    @State private var category: String = ""
    @State private var selectedCategory: Category?
    
    @State private var size: String = ""
    @State private var selectedSize: Size?
    
    @State private var color: String = ""
    @State private var material: String = ""
    @State private var madeIn: String = ""
    @State private var cost: Double = 0
    @State private var purchaseDate: Date = .now
    @State private var note: String = ""
    
    @State private var selectedPhoto: PhotosPickerItem?
    
    var body: some View {
        NavigationStack {
            Form {
                
                Section(header: Text("Item Photo")) {
                    
                    // Turn photo data into UIImage
                    if !image.isEmpty, let uiImage = UIImage(data: image) {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFit()
                    }
                    
                    PhotosPicker(selection: $selectedPhoto, matching: .images, photoLibrary: .shared()) {
                        Label("Add Image", systemImage: "photo")
                    }
                    
                    if !image.isEmpty {
                        Button("Remove Image", role: .destructive, action: {
                            withAnimation {
                                selectedPhoto = nil
                                image = Data()
                            }
                        })
                    }
                }
                
                Section(header: Text("Item Details")) {
                    TextField("Name", text: $name)
                    TextField("Brand", text: $brand)
                    
                    NavigationLink {
                        CategoryListView(selectedCategory: $selectedCategory)
                    } label: {
                        HStack {
                            Text("Category")
                            Spacer()
                            Text(selectedCategory?.value ?? "")
                                .foregroundColor(.secondary)
                        }
                    }
                    NavigationLink {
                        SizeListView(selectedSize: $selectedSize)
                    } label: {
                        HStack {
                            Text("Size")
                            Spacer()
                            Text(selectedSize?.value ?? "")
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    TextField("Color", text: $color)
                    TextField("Material", text: $material)
                    TextField("Made in", text: $madeIn)
                }
                
                Section(header: Text("Purchase Info")) {
                    HStack(spacing: 4) {
                        Text("$")
                            .fontWeight(.semibold)
                        TextField("Cost", value: $cost, format: .currency(code: "US"))
                            .keyboardType(.decimalPad)
                    }
                    DatePicker("Date", selection: $purchaseDate, displayedComponents: .date)
                }
                
                TextField("Note", text: $note)
            }
            .navigationTitle("New Item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button("Save") {
                        let closetItem = ClosetItem(image: image, name: name, brand: brand, category: category, size: size, color: color, material: material, madeIn: madeIn, cost: cost, purchaseDate: purchaseDate, note: note)
                        context.insert(closetItem)
                        dismiss()
                    }
                    .disabled(image.isEmpty || name.isEmpty || brand.isEmpty)
                }
            }
            .task(id: selectedPhoto) {
                
                // Turn UIImage into photo data for storage
                if let data = try? await selectedPhoto?.loadTransferable(type: Data.self) {
                    image = data
                }
            }
        }
    }
}

struct Size: Identifiable {
    let value: String
    let id = UUID()
}


private var sizes = [
    Size(value: "XXS"),
    Size(value: "XS"),
    Size(value: "S"),
    Size(value: "M"),
    Size(value: "L"),
    Size(value: "XL"),
    Size(value: "XXL"),
    Size(value: "XXXL")
]

struct SizeListView: View {
    @Binding var selectedSize: Size?

    var body: some View {
        List {
            ForEach(sizes) { size in
                Button(action: {
                    selectedSize = size
                }) {
                    HStack {
                        Text(size.value)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedSize?.id == size.id {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Select Size")
        .navigationBarTitleDisplayMode(.inline)
    }
}


struct Category: Identifiable {
    let value: String
    let id = UUID()
}


private var categories = [
    Category(value: "Blouses"),
    Category(value: "Bodysuits"),
    Category(value: "Button-Up Shirts"),
    Category(value: "Crop Tops"),
    Category(value: "Hoodies"),
    Category(value: "Overshirts"),
    Category(value: "Polos"),
    Category(value: "Sweaters"),
    Category(value: "Sweater Vests"),
    Category(value: "Sweatshirts"),
    Category(value: "Sports Tops"),
    Category(value: "T-Shirts Long Sleeve"),
    Category(value: "T-Shirts Short Sleeve"),
    Category(value: "Tank Tops")
]

struct CategoryListView: View {
    @Binding var selectedCategory: Category?

    var body: some View {
        List {
            ForEach(categories) { category in
                Button(action: {
                    selectedCategory = category
                }) {
                    HStack {
                        Text(category.value)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedCategory?.id == category.id {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Select Size")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    ClosetView()
}
