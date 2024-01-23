//
//  NotificationsView.swift
//  Worn
//
//  Created by Christopher Gu on 1/23/24.
//

import SwiftUI

struct NotificationItem: Identifiable {
    var id = UUID()
    var title: String
    var content: String
    var iconName: String
    var timestamp: Date
    var isRead: Bool
}

struct NotificationsView: View {
    let notifications: [NotificationItem] = [
        NotificationItem(title: "New Message", content: "You have a new message from a friend.", iconName: "message", timestamp: Date().addingTimeInterval(-120), isRead: false), // Example timestamp: 2 minutes ago
        NotificationItem(title: "Reminder", content: "Don't forget to complete your tasks.", iconName: "alarm", timestamp: Date().addingTimeInterval(-7200), isRead: true) // Example timestamp: 2 hours ago
    ]
    
    func timeAgoString(from timestamp: Date) -> String {
        let now = Date()
        let secondsAgo = Int(now.timeIntervalSince(timestamp))

        let minute = 60
        let hour = 60 * minute
        let day = 24 * hour
        let week = 7 * day

        if secondsAgo < minute {
            return "\(secondsAgo)s"
        } else if secondsAgo < hour {
            let minutes = secondsAgo / minute
            return "\(minutes)m"
        } else if secondsAgo < day {
            let hours = secondsAgo / hour
            return "\(hours)h"
        } else if secondsAgo < week {
            let days = secondsAgo / day
            return "\(days)d"
        } else {
            let weeks = secondsAgo / week
            return "\(weeks)w"
        }
    }
    
    var body: some View {
        List(notifications) { notification in
            HStack(spacing: 20) {
                Image(systemName: notification.iconName)
                    .foregroundColor(.blue)
                VStack(alignment: .leading) {
                    HStack {
                        Text(notification.title)
                            .font(.subheadline)
                            .bold()
                        Spacer()
                        Text(timeAgoString(from: notification.timestamp))
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    Text(notification.content)
                        .font(.subheadline)
                        .foregroundColor(notification.isRead ? .gray : .black)
                }
                .padding(.vertical, 4)
            }
        }
        .listStyle(PlainListStyle())
        .navigationTitle("Notifications")
    }
}

#Preview {
    NotificationsView()
}
