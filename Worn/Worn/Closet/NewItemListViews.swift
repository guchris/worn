//
//  BrandListView.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import SwiftUI


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


/* New Item: Material Field */
struct MaterialListView: View {
    @Binding var selectedMaterials: [UserInputMaterial]
    @State private var materials = loadMaterialsFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var body: some View {
        List {
            ForEach(selectedMaterials.indices, id: \.self) { index in
                Section {
                    MaterialRowView(material: $selectedMaterials[index], selectedMaterials: $selectedMaterials, materials: materials)
                }
            }
            .onDelete { indices in
                selectedMaterials.remove(atOffsets: indices)
            }
            
            Button(action: {
                let newMaterial = UserInputMaterial(id: Int(Date().timeIntervalSince1970), name: "Cotton", percentage: 100)
                selectedMaterials.append(newMaterial)
                print("Selected Materials: \(selectedMaterials)")
            }) {
                Label("Add Material", systemImage: "plus.circle")
            }
        }
        .listStyle(InsetGroupedListStyle())
        .navigationTitle("Add Material")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct MaterialRowView: View {
    @Binding var material: UserInputMaterial
    @Binding var selectedMaterials: [UserInputMaterial]
    var materials: [Material]
    @State private var userPercentage: Int = 0

    var body: some View {
        Picker(selection: $material.name, label: Text("Material")) {
            ForEach(materials) { material in
                Text(material.name).tag(material.name)
            }
        }
        .pickerStyle(MenuPickerStyle())
        
        Picker(selection: $material.percentage, label: Text("Percentage")) {
            ForEach((1...100).reversed(), id: \.self) { userPercentage in
                Text("\(userPercentage)%")
            }
        }
        .pickerStyle(MenuPickerStyle())
        .onChange(of: material) {
            if let index = selectedMaterials.firstIndex(where: { $0.id == material.id }) {
                selectedMaterials[index] = material
            }
        }
    }
}

func loadMaterialsFromJSON() -> [Material] {
    if let url = Bundle.main.url(forResource: "Materials", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let materials = try? JSONDecoder().decode([Material].self, from: data) {
        return materials
    } else {
        print("Error decoding brands from JSON")
        return []
    }
}



/* New Item: Country Field */
struct CountryListView: View {
    @Binding var selectedCountry: Country?
    @State private var countries = loadCountriesFromJSON()
    @State private var searchText = ""
    @Environment(\.presentationMode) private var presentationMode
    
    var filteredCountries: [Country] {
        if searchText.isEmpty {
            return countries
        } else {
            return countries.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        List {
            ForEach(filteredCountries) { country in
                Button(action: {
                    selectedCountry = country
                    presentationMode.wrappedValue.dismiss()
                }) {
                    HStack {
                        Text(country.name)
                            .foregroundColor(.black)
                        Spacer()
                        if selectedCountry?.id == country.id {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Select Country")
        .navigationBarTitleDisplayMode(.inline)
        .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
    }
}

func loadCountriesFromJSON() -> [Country] {
    if let url = Bundle.main.url(forResource: "Countries", withExtension: "json"),
       let data = try? Data(contentsOf: url),
       let countries = try? JSONDecoder().decode([Country].self, from: data) {
        return countries
    } else {
        print("Error decoding brands from JSON")
        return []
    }
}
