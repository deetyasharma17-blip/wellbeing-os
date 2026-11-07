import DeviceActivity
import SwiftUI

@main
struct WellbeingConnectorReport: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        DailyActivityReport { configuration in
            ActivityReportView(configuration: configuration)
        }
        WeeklyActivityReport { configuration in
            ActivityReportView(configuration: configuration)
        }
    }
}

struct DailyActivityReport: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .daily
    let content: (ActivityReportConfiguration) -> ActivityReportView

    func makeConfiguration(representing data: DeviceActivityReportData) async -> ActivityReportConfiguration {
        await ActivityReportConfiguration.make(from: data, period: "Daily")
    }
}

struct WeeklyActivityReport: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .weekly
    let content: (ActivityReportConfiguration) -> ActivityReportView

    func makeConfiguration(representing data: DeviceActivityReportData) async -> ActivityReportConfiguration {
        await ActivityReportConfiguration.make(from: data, period: "Weekly")
    }
}

struct ActivityReportConfiguration {
    let period: String
    let totalDuration: TimeInterval
    let applicationCount: Int
    let categoryCount: Int
    let websiteCount: Int

    static func make(from data: DeviceActivityReportData, period: String) async -> Self {
        var total: TimeInterval = 0
        var applications = 0
        var categories = 0
        var websites = 0
        for await segment in data {
            total += segment.totalActivityDuration
            applications += segment.applications.count
            categories += segment.categories.count
            websites += segment.webDomains.count
        }
        return Self(period: period, totalDuration: total, applicationCount: applications, categoryCount: categories, websiteCount: websites)
    }
}

struct ActivityReportView: View {
    let configuration: ActivityReportConfiguration

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("\(configuration.period) report")
                .font(.headline)
            if configuration.totalDuration == 0 {
                ContentUnavailableView("No activity available", systemImage: "chart.bar.xaxis", description: Text("Apple did not provide activity for this reporting period."))
            } else {
                Text(formatDuration(configuration.totalDuration))
                    .font(.largeTitle.bold())
                Text("Available app summaries: \(configuration.applicationCount)")
                Text("Categories: \(configuration.categoryCount)")
                Text("Websites: \(configuration.websiteCount)")
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
    }

    private func formatDuration(_ duration: TimeInterval) -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .abbreviated
        return formatter.string(from: duration) ?? "Unavailable"
    }
}
