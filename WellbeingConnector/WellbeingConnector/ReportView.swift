import DeviceActivity
import FamilyControls
import SwiftUI

struct ReportView: View {
    @EnvironmentObject private var model: ConnectorModel
    @State private var period: ReportPeriod = .today
    @State private var selection = FamilyActivitySelection()

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Picker("Reporting period", selection: $period) {
                    ForEach(ReportPeriod.allCases) { value in
                        Text(value.label).tag(value)
                    }
                }
                .pickerStyle(.segmented)
                if model.authorizationStatus == .approved {
                    DeviceActivityReport(
                        .init(period.context),
                        filter: DeviceActivityFilter(
                            segment: .daily(
                                during: period.dateInterval
                            ),
                            applications: selection.applicationTokens,
                            categories: selection.categoryTokens,
                            webDomains: selection.webDomainTokens
                        )
                    )
                } else {
                    ContentUnavailableView(
                        "Screen Time access needed",
                        systemImage: "lock.shield",
                        description: Text("Authorize access before requesting an Apple report.")
                    )
                }
            }
            .padding()
            .navigationTitle("Screen Time")
        }
    }
}

enum ReportPeriod: String, CaseIterable, Identifiable {
    case today
    case week

    var id: String { rawValue }
    var label: String { self == .today ? "Today" : "This week" }
    var context: DeviceActivityReport.Context {
        self == .today ? .daily : .weekly
    }
    var dateInterval: DateInterval {
        let calendar = Calendar.current
        let end = Date()
        let start = self == .today
            ? calendar.startOfDay(for: end)
            : calendar.date(byAdding: .day, value: -7, to: end) ?? end
        return DateInterval(start: start, end: end)
    }
}

extension DeviceActivityReport.Context {
    static let daily = Self("wellbeing.daily.report")
    static let weekly = Self("wellbeing.weekly.report")
}
