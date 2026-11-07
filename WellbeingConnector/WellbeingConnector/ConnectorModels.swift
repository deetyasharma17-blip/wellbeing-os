import Foundation

enum ConnectorPermissionStatus: String, Codable {
    case notDetermined
    case authorized
    case denied
    case unavailable
}

enum ConnectorDataSource: String, Codable {
    case appleDeviceActivity
    case activityThreshold
}

enum ConnectorSyncStatus: String, Codable {
    case localOnly
    case readyForAuthorizedSync
    case unavailable
}

struct ConnectorActivitySummary: Codable, Identifiable {
    let id: UUID
    let deviceIdentifier: String
    let deviceType: String
    let reportingPeriodStart: Date
    let reportingPeriodEnd: Date
    let totalDurationSeconds: TimeInterval?
    let appCategorySummaryAvailable: Bool
    let websiteSummaryAvailable: Bool
    let recordedAt: Date
    let permissionStatus: ConnectorPermissionStatus
    let dataSource: ConnectorDataSource
    let syncStatus: ConnectorSyncStatus
}

struct ConnectorThresholdEvent: Codable, Identifiable {
    let id: UUID
    let deviceIdentifier: String
    let eventIdentifier: String
    let occurredAt: Date
    let permissionStatus: ConnectorPermissionStatus
    let dataSource: ConnectorDataSource
}
