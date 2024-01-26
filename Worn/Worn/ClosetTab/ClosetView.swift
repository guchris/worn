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
    
    @State private var selectedCategory: String?
    @State private var selectedBrand: String?
    @State private var selectedSize: String?
    @State private var selectedColor: String?
    @State private var selectedMaterial: String?
    @State private var selectedCountry: String?
    
    @State private var isShowingClosetItemSheet = false
    @State private var isShowingFilterSheet = false
    
    @State private var filteredItems: [Item] = []
    @Query(sort: \Item.createdDate) var closetItems: [Item] = []
    
    // Function to clear all filters
    private func clearFilters() {
        selectedCategory = nil
        selectedBrand = nil
        selectedSize = nil
        selectedColor = nil
        selectedMaterial = nil
        selectedCountry = nil
        filteredItems = closetItems
    }
    
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
                    Button {
                        isShowingFilterSheet = true
                    } label: {
                        if selectedCategory != nil || selectedBrand != nil || selectedSize != nil || selectedColor != nil {
                            Image(systemName: "line.3.horizontal.circle.fill")
                        } else {
                            Image(systemName: "line.3.horizontal.decrease.circle")
                        }
                    }
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
            .sheet(isPresented: $isShowingFilterSheet) {
                FilterOptionsSheet(
                    selectedCategory: $selectedCategory,
                    selectedBrand: $selectedBrand,
                    selectedSize: $selectedSize,
                    selectedColor: $selectedColor,
                    filteredItems: $filteredItems,
                    isShowingFilterSheet: $isShowingFilterSheet,
                    clearFilters: clearFilters
                )
            }
        }
    }
}

struct FilterOptionsSheet: View {
    @Binding var selectedCategory: String?
    @Binding var selectedBrand: String?
    @Binding var selectedSize: String?
    @Binding var selectedColor: String?
    
    @State private var categories: [String] = []
    @State private var brands: [String] = []
    @State private var sizes: [String] = []
    @State private var colors: [String] = []
    
    
    @Binding var filteredItems: [Item]
    @Binding var isShowingFilterSheet: Bool
    var clearFilters: () -> Void
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 16) {
                List {
                    NavigationLink(destination: FilterOptionListView(selectedOption: $selectedCategory, options: categories)) {
                        HStack {
                            Text("Category")
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedCategory ?? "")
                                Spacer()
                            }
                        }
                    }
                    
                    NavigationLink(destination: FilterOptionListView(selectedOption: $selectedBrand, options: brands)) {
                        HStack {
                            Text("Brand")
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedBrand ?? "")
                                Spacer()
                            }
                        }
                    }

                    NavigationLink(destination: FilterOptionListView(selectedOption: $selectedSize, options: sizes)) {
                        HStack {
                            Text("Size")
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedSize ?? "")
                                Spacer()
                            }
                        }
                    }

                    NavigationLink(destination: FilterOptionListView(selectedOption: $selectedColor, options: colors)) {
                        HStack {
                            Text("Color")
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedColor ?? "")
                                Spacer()
                            }
                        }
                    }
                    
                    Section {
                        Button("Clear Filters") {
                            clearFilters()
                        }
                    }
                }
            }
            .onAppear {
                loadFilterOptions()
            }
            .navigationTitle("Filter")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing: Button("Done") {
                isShowingFilterSheet = false
            })
        }
    }
    
    private func loadFilterOptions() {
        loadCategories()
        loadBrands()
        loadSizes()
        loadColors()
    }
    
    private func loadCategories() {
        if let url = Bundle.main.url(forResource: "Categories", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let decodedCategories = try? JSONDecoder().decode([Category].self, from: data) {
            categories = decodedCategories.map { $0.name }
        }
    }
    
    private func loadBrands() {
        if let url = Bundle.main.url(forResource: "Brands", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let decodedBrands = try? JSONDecoder().decode([Brand].self, from: data) {
            brands = decodedBrands.map { $0.name }
        }
    }
    
    private func loadSizes() {
        if let url = Bundle.main.url(forResource: "Sizes", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let decodedSizes = try? JSONDecoder().decode([Size].self, from: data) {
            sizes = decodedSizes.map { $0.name }
        }
    }
    
    private func loadColors() {
        if let url = Bundle.main.url(forResource: "Colors", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let decodedColors = try? JSONDecoder().decode([CustomColor].self, from: data) {
            colors = decodedColors.map { $0.name }
        }
    }
}

struct FilterOptionListView: View {
    @Binding var selectedOption: String?
    @Environment(\.presentationMode) private var presentationMode
    var options: [String]
    
    var body: some View {
        List {
            ForEach(options, id: \.self) { option in
                Button(action: {
                    selectedOption = option
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        Text(option)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedOption == option {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationBarTitle("Select \(selectedOption ?? "")")
    }
}


struct ClosetItemCell: View {
    
    let closetItem: Item
    
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
    @State private var selectedMaterials: [UserInputMaterial] = []
    
    @State private var madeIn: String = ""
    @State private var selectedCountry: Country?
    
    @State private var cost: Double = 0
    @State private var purchaseDate: Date = .now
    @State private var note: String = ""
    
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var createdDate: Date = .now
    
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
                    
                    NavigationLink {
                        MaterialListView(selectedMaterials: $selectedMaterials)
                    } label: {
                        HStack {
                            Text("Material")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                VStack(alignment: .leading) {
                                    ForEach(selectedMaterials) { material in
                                        let percentageString = "\(Int(material.percentage))%"
                                        Text("\(percentageString) \(material.name)")
                                    }
                                }
                                Spacer()
                            }
                        }
                    }
                    
                    NavigationLink {
                        CountryListView(selectedCountry: $selectedCountry)
                    } label: {
                        HStack {
                            Text("Made in")
                                .font(.headline)
                                .frame(minWidth: 100, alignment: .leading)
                            HStack {
                                Text(selectedCountry?.name ?? "")
                                Spacer()
                            }
                        }
                    }
                    .onChange(of: selectedCountry) {
                        madeIn = selectedCountry?.name ?? ""
                    }
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
                        createdDate = .now
                        let closetItem = Item(image: image, name: name, brand: brand, category: category, size: size, color: color, material: material, madeIn: madeIn, cost: cost, purchaseDate: purchaseDate, note: note, createdDate: createdDate)
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

#Preview {
    ClosetView()
}
