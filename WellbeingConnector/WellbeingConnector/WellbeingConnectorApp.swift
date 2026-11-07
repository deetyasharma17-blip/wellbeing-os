import SwiftUI

@main
struct WellbeingConnectorApp: App {
    @StateObject private var model = ConnectorModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(model)
                .tint(ConnectorTheme.lavender)
        }
    }
}
