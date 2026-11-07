import DeviceActivity
import Foundation

final class WellbeingActivityMonitor: DeviceActivityMonitor {
    private let eventsKey = "wellbeing.activity.threshold-events"

    override func intervalDidStart(for activity: DeviceActivityName) {
        record("interval_started:\(activity.rawValue)")
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        record("interval_ended:\(activity.rawValue)")
    }

    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityApplication?) {
        record("threshold_reached:\(event.rawValue)")
    }

    override func eventWillReachThresholdWarning(_ event: DeviceActivityEvent.Name, activity: DeviceActivityApplication?) {
        record("threshold_warning:\(event.rawValue)")
    }

    private func record(_ value: String) {
        let defaults = UserDefaults(suiteName: "group.com.example.wellbeingconnector")
        var values = defaults?.stringArray(forKey: eventsKey) ?? []
        values.append("\(Date().ISO8601Format())|\(value)")
        defaults?.set(values.suffix(50), forKey: eventsKey)
    }
}
