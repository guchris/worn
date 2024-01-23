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
    @State private var selectedBrand: Brand?
    
    @State private var category: String = ""
    @State private var selectedCategory: Category?
    
    @State private var size: String = ""
    @State private var selectedSize: Size?
    
    @State private var color: String = ""
    @State private var selectedColor: CustomColor?
    
    @State private var material: String = ""
    @State private var madeIn: String = ""
    @State private var cost: Double = 0
    @State private var purchaseDate: Date = .now
    @State private var note: String = ""
    
    @State private var selectedPhoto: PhotosPickerItem?
    
    var body: some View {
        NavigationStack {
            Form {
                
                Section(header: Text("Photo")) {
                    
                    // Turn photo data into UIImage
                    if !image.isEmpty, let uiImage = UIImage(data: image) {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFit()
                            .cornerRadius(8)
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
                
                Section(header: Text("Details")) {
                    TextField("Name", text: $name)
                    
                    NavigationLink {
                        BrandListView(selectedBrand: $selectedBrand)
                    } label: {
                        HStack {
                            Text("Brand")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedBrand?.name ?? "")
                                Spacer()
                            }
                        }
                    }
                    .onChange(of: selectedBrand) {
                        brand = selectedBrand?.name ?? ""
                    }
                    

                    NavigationLink {
                        CategoryListView(selectedCategory: $selectedCategory)
                    } label: {
                        HStack {
                            Text("Category")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedCategory?.name ?? "")
                                Spacer()
                            }
                        }
                    }
                    .onChange(of: selectedCategory) {
                        category = selectedCategory?.name ?? ""
                    }
                    
                    NavigationLink {
                        SizeListView(selectedSize: $selectedSize)
                    } label: {
                        HStack {
                            Text("Size")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedSize?.name ?? "")
                                Spacer()
                            }
                        }
                    }
                    .onChange(of: selectedSize) {
                        size = selectedSize?.name ?? ""
                    }
                    
                    NavigationLink {
                        ColorListView(selectedColor: $selectedColor)
                    } label: {
                        HStack {
                            Text("Color")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedColor?.name ?? "")
                                Spacer()
                            }
                        }
                    }
                    .onChange(of: selectedColor) {
                        color = selectedColor?.name ?? ""
                    }
                    
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
                
                Section(header: Text("Notes")) {
                    TextEditor(text: $note)
                        .frame(minHeight: 100)
                }
                
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


/* New Item: Size Field */

struct SizeListView: View {
    @Binding var selectedSize: Size?
    @State private var sizes = loadSizesFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var filteredSizes: [Size] {
        if searchText.isEmpty {
            return sizes
        } else {
            return sizes.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        List {
            ForEach(filteredSizes) { size in
                Button(action: {
                    selectedSize = size
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        Text(size.name)
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
        .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
    }
}

func loadSizesFromJSON() -> [Size] {
    if let url = Bundle.main.url(forResource: "Sizes", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let sizes = try? JSONDecoder().decode([Size].self, from: data) {
        return sizes
    } else {
        print("Error decoding sizes from JSON")
        return []
    }
}


/* New Item: Category Field */

struct CategoryListView: View {
    @Binding var selectedCategory: Category?
    @State private var categories = loadCategoriesFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var filteredCategories: [Category] {
        if searchText.isEmpty {
            return categories
        } else {
            return categories.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        List {
            ForEach(filteredCategories) { category in
                Button(action: {
                    selectedCategory = category
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        Text(category.name)
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
        .navigationTitle("Select Category")
        .navigationBarTitleDisplayMode(.inline)
        .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
    }
}

func loadCategoriesFromJSON() -> [Category] {
    if let url = Bundle.main.url(forResource: "Categories", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let categories = try? JSONDecoder().decode([Category].self, from: data) {
        return categories
    } else {
        print("Error decoding categories from JSON")
        return []
    }
}


/* New Item: Brand Field */

struct BrandListView: View {
    @Binding var selectedBrand: Brand?
    @State private var brands = loadBrandsFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var filteredBrands: [Brand] {
        if searchText.isEmpty {
            return brands
        } else {
            return brands.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        List {
            ForEach(filteredBrands) { brand in
                Button(action: {
                    selectedBrand = brand
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        Text(brand.name)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedBrand?.id == brand.id {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Select Brand")
        .navigationBarTitleDisplayMode(.inline)
        .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
    }
}

func loadBrandsFromJSON() -> [Brand] {
    if let url = Bundle.main.url(forResource: "Brands", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let brands = try? JSONDecoder().decode([Brand].self, from: data) {
        return brands
    } else {
        print("Error decoding brands from JSON")
        return []
    }
}

/* New Item: Color Field */

struct ColorListView: View {
    @Binding var selectedColor: CustomColor?
    @State private var colors = loadColorsFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var filteredColors: [CustomColor] {
        if searchText.isEmpty {
            return colors
        } else {
            return colors.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        List {
            ForEach(filteredColors) { color in
                Button(action: {
                    selectedColor = color
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        RoundedRectangle(cornerRadius: 8)
                            .foregroundColor(Color(hex: color.hex))
                            .frame(width: 30, height: 30)
                        Text(color.name)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedColor?.id == color.id {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Select Color")
        .navigationBarTitleDisplayMode(.inline)
        .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
    }
}

func loadColorsFromJSON() -> [CustomColor] {
    if let url = Bundle.main.url(forResource: "Colors", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let colors = try? JSONDecoder().decode([CustomColor].self, from: data) {
        return colors
    } else {
        print("Error decoding brands from JSON")
        return []
    }
}

#Preview {
    ClosetView()
}
