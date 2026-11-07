import SwiftUI

struct RootView: View {
    @EnvironmentObject private var model: ConnectorModel

    var body: some View {
        TabView {
            WelcomeView()
                .tabItem { Label("Home", systemImage: "sparkles") }
            PermissionView()
                .tabItem { Label("Permission", systemImage: "lock.shield") }
            ReportView()
                .tabItem { Label("Screen Time", systemImage: "chart.bar.xaxis") }
            MonitoringView()
                .tabItem { Label("Monitoring", systemImage: "moon.stars") }
        }
        .onAppear { model.refreshAuthorizationStatus() }
    }
}

struct WelcomeView: View {
    @EnvironmentObject private var model: ConnectorModel

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    Text("wellbeingOS")
                        .font(.headline)
                        .foregroundStyle(ConnectorTheme.lavender)
                    Text("Your iPhone companion.")
                        .font(.largeTitle.bold())
                        .foregroundStyle(ConnectorTheme.ink)
                    Text("This native companion uses Apple’s privacy-preserving Screen Time frameworks. It does not confirm sleep or expose last unlock time.")
                        .foregroundStyle(.secondary)
                    StatusCard(status: model.authorizationStatus)
                    NavigationLink("Review permissions") {
                        PermissionView()
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
            .background(ConnectorTheme.canvas.ignoresSafeArea())
            .navigationTitle("Welcome")
        }
    }
}

struct StatusCard: View {
    let status: AuthorizationStatus

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Connection status", systemImage: status == .approved ? "checkmark.shield.fill" : "exclamationmark.shield")
                .font(.headline)
            Text(statusLabel)
                .foregroundStyle(.secondary)
            Text("Data source: Apple DeviceActivity")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.white, in: RoundedRectangle(cornerRadius: 18))
    }

    private var statusLabel: String {
        switch status {
        case .approved: "Authorized"
        case .denied: "Denied. Enable access in Settings."
        case .notDetermined: "Permission has not been requested."
        @unknown default: "Unavailable on this device or configuration."
        }
    }
}
