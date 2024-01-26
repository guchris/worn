//
//  YouView.swift
//  Worn
//
//  Created by Christopher Gu on 1/18/24.
//

import SwiftUI

struct YouView: View {
    
    @State private var showViewMore = true
    
    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())]) {
                    StatContainer(title: "Total Items", value: "100", showViewMore: false, details: nil)
                    StatContainer(title: "Total Cost", value: "$500", showViewMore: false, details: nil)
                }
                
                StatContainer(title: "Top Brand", value: "Acne Studios", showViewMore: true, details: ["Acne Studios", "Aimé Leon Dore", "Sandro", "Theory", "John Elliot", "On Running"])
                StatContainer(title: "Top Category", value: "Sweater Vests", showViewMore: true, details: ["Sweater Vests", "Cargo Pants", "Crop Tops", "Cardigans"])
                
                BarGraph(dataPoints: [10, 30, 45, 25, 60, 35])
                    .frame(height: 200)
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
        }
    }
}

struct StatContainer: View {
    let title: String
    let value: String
    let showViewMore: Bool
    let details: [String]?
    
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
                        NavigationLink(destination: DetailedListView(details: details)) {
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
    let details: [String]
    
    var body: some View {
        List(details, id: \.self) { detail in
            Text(detail)
        }
        .listStyle(InsetGroupedListStyle())
        .navigationBarTitle("Details", displayMode: .inline)
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
