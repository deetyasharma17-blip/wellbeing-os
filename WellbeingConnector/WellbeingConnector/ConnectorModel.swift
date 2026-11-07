import DeviceActivity
import FamilyControls
import Foundation

@MainActor
final class ConnectorModel: ObservableObject {
    @Published private(set) var authorizationStatus: AuthorizationStatus = .notDetermined
    @Published private(set) var permissionError: String?
    @Published private(set) var monitoringEnabled = false
    @Published var bedtime = DateComponents(hour: 22, minute: 30)
    @Published var morning = DateComponents(hour: 7, minute: 0)
    @Published var thresholdMinutes = 120

    let authorizationCenter = AuthorizationCenter.shared
    let activityCenter = DeviceActivityCenter()
    let deviceIdentifier = "iphone-primary"

    init() {
        authorizationStatus = authorizationCenter.authorizationStatus
    }

    func requestAuthorization() async {
        permissionError = nil
        do {
            try await authorizationCenter.requestAuthorization(for: .individual)
            authorizationStatus = authorizationCenter.authorizationStatus
        } catch {
            permissionError = error.localizedDescription
            authorizationStatus = authorizationCenter.authorizationStatus
        }
    }

    func refreshAuthorizationStatus() {
        authorizationStatus = authorizationCenter.authorizationStatus
    }

    func startMonitoring() {
        permissionError = nil
        let schedule = DeviceActivitySchedule(
            intervalStart: bedtime,
            intervalEnd: morning,
            repeats: true
        )
        let event = DeviceActivityEvent(threshold: DateComponents(minute: thresholdMinutes))
        do {
            try activityCenter.startMonitoring(
                .wellbeingDaily,
                during: schedule,
                events: [.digitalActivity: event]
            )
            monitoringEnabled = true
        } catch {
            permissionError = error.localizedDescription
        }
    }

    func stopMonitoring() {
        activityCenter.stopMonitoring([.wellbeingDaily])
        monitoringEnabled = false
    }
}

extension DeviceActivityName {
    static let wellbeingDaily = Self("wellbeing.daily")
}

extension DeviceActivityEvent.Name {
    static let digitalActivity = Self("digital.activity")
}
