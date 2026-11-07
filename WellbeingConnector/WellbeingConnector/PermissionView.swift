import FamilyControls
import SwiftUI

struct PermissionView: View {
    @EnvironmentObject private var model: ConnectorModel
    @State private var selection = FamilyActivitySelection()
    @State private var showingPicker = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Why access is requested") {
                    Text("WellbeingConnector uses Apple’s Family Controls permission so you can choose what activity to include in a personal Screen Time report. The app cannot bypass this approval.")
                }
                Section("Authorization") {
                    StatusCard(status: model.authorizationStatus)
                    Button("Request Screen Time access") {
                        Task { await model.requestAuthorization() }
                    }
                    .disabled(model.authorizationStatus == .approved)
                }
                Section("Report selection") {
                    Button("Choose apps, categories, or websites") {
                        showingPicker = true
                    }
                    Text(selectionSummary)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let error = model.permissionError {
                    Section {
                        Text(error)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Permission")
            .familyActivityPicker(isPresented: $showingPicker, selection: $selection)
        }
    }

    private var selectionSummary: String {
        "\(selection.applicationTokens.count) apps · \(selection.categoryTokens.count) categories · \(selection.webDomainTokens.count) websites selected"
    }
}
