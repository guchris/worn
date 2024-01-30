//
//  YouView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI
import SwiftData
import Charts

struct YouView: View {
    @Environment(\.modelContext) var context
    @Query var closetItems: [Item] = []
    @State private var showViewMore = true
    @State private var totalItems: Int = 0
    @State private var totalSpent: Double = 0.0
    
    @State private var topBrand: String = ""
    @State private var topCategory: String = ""
    
    @State private var detailsForTopBrand: [(String, Int)] = []
    @State private var detailsForTopCategory: [(String, Int)] = []

    
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())]) {
                    StatContainer(title: "Total Items", value: "\(totalItems)", showViewMore: false, subTitle: nil, details: nil)
                    StatContainer(title: "Total Spent", value: "$\(totalSpent)", showViewMore: false, subTitle: nil, details: nil)
                }
                
                StatContainer(title: "Top Brand", value: topBrand, showViewMore: true, subTitle: "Top Brands", details: detailsForTopBrand)
                StatContainer(title: "Top Category", value: topCategory, showViewMore: true, subTitle: "Top Categories", details: detailsForTopCategory)
                
//                BarGraph(dataPoints: [10, 30, 45, 25, 60, 35])
//                    .frame(height: 200)
            }
            .padding(24)
            .navigationTitle("You")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {} label: { Image(systemName: "person.crop.circle.fill") }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {} label: { Image(systemName: "gearshape") }
                }
            }
            .onAppear {
                calculateStats()
            }
        }
    }
    
    private func calculateStats() {
        totalItems = closetItems.count
        totalSpent = closetItems.reduce(0.0) { $0 + ($1.cost ?? 0.0) }
        

        // Calculate top brand
        let brandCounts = Dictionary(grouping: closetItems, by: { $0.brand })
            .mapValues { $0.count }
        
        // Sorting by count descending, and by creation date if counts are equal
        let sortedBrands = brandCounts.sorted { (first, second) in
            if first.value == second.value {
                // Sort by creation date if counts are equal
                guard let firstDate = closetItems.first(where: { $0.brand == first.key })?.createdDate,
                      let secondDate = closetItems.first(where: { $0.brand == second.key })?.createdDate else {
                    return false
                }
                return firstDate < secondDate
            } else {
                // Sort by count descending
                return first.value > second.value
            }
        }

        // Set topBrand to the first element of the sorted array, if available
        topBrand = sortedBrands.first?.key ?? ""

        // Calculate details array for top brands
        detailsForTopBrand = sortedBrands
        
        


        // Calculate top category
        let categoryCounts = Dictionary(grouping: closetItems, by: { $0.category })
            .mapValues { $0.count }
        
        // Sorting by count descending, and by creation date if counts are equal
        let sortedCategories = categoryCounts.sorted { (first, second) in
            if first.value == second.value {
                // Sort by creation date if counts are equal
                guard let firstDate = closetItems.first(where: { $0.category == first.key })?.createdDate,
                      let secondDate = closetItems.first(where: { $0.category == second.key })?.createdDate else {
                    return false
                }
                return firstDate < secondDate
            } else {
                // Sort by count descending
                return first.value > second.value
            }
        }

        // Set topCategory to the first element of the sorted array, if available
        topCategory = sortedCategories.first?.key ?? ""

        // Calculate details array for top categories
        detailsForTopCategory = sortedCategories
    }
}

struct StatContainer: View {
    let title: String
    let value: String
    let showViewMore: Bool
    let subTitle: String?
    let details: [(String, Int)]?

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(title)
                    .font(.subheadline)
                    .bold()
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                if showViewMore, let details = details {
                    HStack {
                        NavigationLink(destination: DetailedListView(subTitle: subTitle ?? "", details: details)) {
                            Text("View More")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
            Spacer()
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
    }
}

struct DetailedListView: View {
    let subTitle: String
    let details: [(String, Int)]
    @State private var selection = 0

    var body: some View {
        VStack {
            
            Picker(selection: $selection, label: Text("")) {
                Text("List").tag(0)
                Text("Chart").tag(1)
            }
            .pickerStyle(SegmentedPickerStyle())
            
            
            if selection == 0 {
                List(details, id: \.0) { detail in
                    HStack {
                        Text(detail.0)
                        Spacer()
                        Text("\(detail.1)")
                    }
                }
                .listStyle(.plain)
            } else {
                Chart {
                    ForEach(details, id: \.0) { detail in
                        SectorMark(angle: .value(detail.0, detail.1),
                                   innerRadius: .ratio(0.618),
                                   angularInset: 2)
                            .foregroundStyle(by: .value("Name", detail.0))
                            .cornerRadius(8)
                            .annotation(position: .overlay) {
                                Text("\(detail.1)")
                                    .bold()
                                    .foregroundStyle(.white)
                            }
                    }
                }
                .chartLegend(.hidden)
            }
            
            Spacer()
        }
        .padding()
        .navigationBarTitle(subTitle, displayMode: .inline)
    }
}

struct BarGraph: View {
    let dataPoints: [Double]

    var body: some View {
        VStack(alignment: .leading) {
            
            Text("Outfits")
                .font(.headline)
                .fontWeight(.bold)
            
            ZStack {
                GeometryReader { geometry in
                    let width = geometry.size.width
                    let height = geometry.size.height
                    let stepX = width / CGFloat(dataPoints.count)
                    let stepY = height / CGFloat(dataPoints.max() ?? 1)
                    let barWidth = stepX - 20

                    // Dotted Vertical Lines
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: 0))
                        path.addLine(to: CGPoint(x: 0, y: height))
                    }
                    .stroke(Color.gray.opacity(0.25), style: StrokeStyle(lineWidth: 1, dash: [5]))
                    
                    ForEach(1..<dataPoints.count, id: \.self) { index in
                        let x = stepX * CGFloat(index)
                        Path { path in
                            path.move(to: CGPoint(x: x, y: 0))
                            path.addLine(to: CGPoint(x: x, y: height))
                        }
                        .stroke(Color.gray.opacity(0.25), style: StrokeStyle(lineWidth: 1, dash: [5]))
                    }
                    
                    Path { path in
                        path.move(to: CGPoint(x: width, y: 0))
                        path.addLine(to: CGPoint(x: width, y: height))
                    }
                    .stroke(Color.gray.opacity(0.25), style: StrokeStyle(lineWidth: 1, dash: [5]))
                    
                    // Solid Horizontal Lines
                    let maxLineY = height - CGFloat(dataPoints.max() ?? 1) * stepY
                    let zeroLineY = height
                    
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: maxLineY))
                        path.addLine(to: CGPoint(x: width, y: maxLineY))
                    }
                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                    
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: zeroLineY))
                        path.addLine(to: CGPoint(x: width, y: zeroLineY))
                    }
                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                    
                    // In-Between Lines
                    let inBetweenLine1Y = height - 0.25 * CGFloat(dataPoints.max() ?? 1) * stepY
                    let inBetweenLine2Y = height - 0.5 * CGFloat(dataPoints.max() ?? 1) * stepY
                    let inBetweenLine3Y = height - 0.75 * CGFloat(dataPoints.max() ?? 1) * stepY
                    
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: inBetweenLine1Y))
                        path.addLine(to: CGPoint(x: width, y: inBetweenLine1Y))
                    }
                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                    
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: inBetweenLine2Y))
                        path.addLine(to: CGPoint(x: width, y: inBetweenLine2Y))
                    }
                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                    
                    Path { path in
                        path.move(to: CGPoint(x: 0, y: inBetweenLine3Y))
                        path.addLine(to: CGPoint(x: width, y: inBetweenLine3Y))
                    }
                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                    
                    // Top Line Label
                    Text("\(Int(dataPoints.max() ?? 0))")
                        .position(x: width + 10, y: maxLineY - 10)
                        .foregroundColor(Color.gray.opacity(0.25))
                    
                    // Bottom Line Label
                    Text("0")
                        .position(x: width + 10, y: zeroLineY + 10)
                        .foregroundColor(Color.gray.opacity(0.25))

                    // Bars
                    ForEach(0..<dataPoints.count, id: \.self) { index in
                        let x = stepX * CGFloat(index)
                        let y = CGFloat(dataPoints[index]) * stepY

                        RoundedRectangle(cornerRadius: 8)
                            .frame(width: barWidth, height: max(y, 10))
                            .foregroundColor(Color.blue)
                            .position(x: x + stepX/2, y: height - y/2)

                        // Labels underneath each bar
                        let monthLabels = ["A", "S", "O", "N", "D", "J"]
                        if index < monthLabels.count {
                            Text(monthLabels[index])
                                .position(x: x + stepX/2, y: height + 15)
                                .foregroundColor(Color.gray.opacity(0.5))
                        }
                    }
                }
            }
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
    }
}




//struct LineGraph: View {
//    let dataPoints: [Double]
//
//    var body: some View {
//        GeometryReader { geometry in
//            let width = geometry.size.width
//            let height = geometry.size.height
//            let stepX = width / CGFloat(dataPoints.count - 1)
//            let stepY = height / CGFloat(dataPoints.max() ?? 1)
//
//            ZStack {
//                Path { path in
//                    for (index, dataPoint) in dataPoints.enumerated() {
//                        let x = stepX * CGFloat(index)
//                        let y = height - CGFloat(dataPoint) * stepY
//
//                        if index == 0 {
//                            path.move(to: CGPoint(x: x, y: y))
//                        } else {
//                            path.addLine(to: CGPoint(x: x, y: y))
//                        }
//                    }
//                }
//                .stroke(Color.blue, lineWidth: 2)
//
//                // Vertical Lines
//                ForEach(0..<dataPoints.count, id: \.self) { index in
//                    let x = stepX * CGFloat(index)
//                    Path { path in
//                        path.move(to: CGPoint(x: x, y: 0))
//                        path.addLine(to: CGPoint(x: x, y: height))
//                    }
//                    .stroke(Color.gray.opacity(0.5), lineWidth: 1)
//                }
//            }
//        }
//        .padding()
//        .background(RoundedRectangle(cornerRadius: 12).foregroundColor(.white))
//        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.5), lineWidth: 1))
//    }
//}

#Preview {
    YouView()
}
