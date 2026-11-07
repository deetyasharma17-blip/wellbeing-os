import SwiftUI

struct MonitoringView: View {
    @EnvironmentObject private var model: ConnectorModel

    var body: some View {
        NavigationStack {
            Form {
                Section("Schedule") {
                    DatePicker("Usual bedtime", selection: dateBinding(for: \.bedtime), displayedComponents: .hourAndMinute)
                    DatePicker("Usual waking time", selection: dateBinding(for: \.morning), displayedComponents: .hourAndMinute)
                    Stepper("Activity threshold: \(model.thresholdMinutes) minutes", value: $model.thresholdMinutes, in: 15...480, step: 15)
                }
                Section {
                    Button(model.monitoringEnabled ? "Stop monitoring" : "Start monitoring") {
                        model.monitoringEnabled ? model.stopMonitoring() : model.startMonitoring()
                    }
                    .disabled(model.authorizationStatus != .approved)
                    Text("Threshold callbacks indicate configured activity events. They do not prove sleep, wakefulness, or wellbeing state.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let error = model.permissionError {
                    Text(error).foregroundStyle(.red)
                }
            }
            .navigationTitle("Monitoring")
        }
    }

    private func dateBinding(for keyPath: ReferenceWritableKeyPath<ConnectorModel, DateComponents>) -> Binding<Date> {
        Binding {
            let components = model[keyPath: keyPath]
            return Calendar.current.date(from: components) ?? Date()
        } set: { value in
            model[keyPath: keyPath] = Calendar.current.dateComponents([.hour, .minute], from: value)
        }
    }
}
