# WellbeingConnector

Separate SwiftUI companion app for the AI Wellbeing OS iPhone experience. This project does not modify the React website.

## What this project uses

- SwiftUI
- FamilyControls for user authorization and `FamilyActivityPicker`
- DeviceActivity for scheduled monitoring and threshold callbacks
- DeviceActivityReport extension for privacy-preserving Screen Time reports
- ManagedSettings is not used until a user-facing blocking feature is explicitly added

## Required Apple setup

1. Open `WellbeingConnector.xcodeproj` in full Xcode.
2. Set a unique team and bundle identifiers for both targets.
3. Add the Family Controls capability to the app and report extension.
4. Request the Family Controls entitlement from Apple for distribution. A development build may still require the entitlement and a signed provisioning profile.
5. Test on a physical iPhone. Screen Time APIs are not fully representative in the simulator.

The report extension must use the extension point `com.apple.deviceactivityui.report-extension`. The app and extension require the Family Controls entitlement:

```xml
<key>com.apple.developer.family-controls</key>
<true/>
```

## Data boundary

The report extension receives privacy-preserving `DeviceActivityReportData` from the system. The main app can present a `DeviceActivityReport`, but it cannot request arbitrary raw Screen Time records from the extension. The extension must not make network requests. This project therefore does not invent an export of app-level report details.

The shared model in `WellbeingConnector/ConnectorModels.swift` describes data that may be sent to a future backend only when the OS makes that summary available to an approved integration path. Permission state, reporting periods, monitoring events, and sync status are exportable metadata. Last unlock time and confirmed sleep are not collected because Apple does not provide them through these APIs.

## Testing

- Build and run the main app on a physical iPhone using Xcode.
- Open the Permission screen and request Family Controls authorization.
- Select apps/categories/web domains with `FamilyActivityPicker`.
- Open the Screen Time report for a daily or weekly period.
- Configure bedtime and morning monitoring.
- Use a short test threshold and observe supported `DeviceActivityMonitor` callbacks.
- Verify denied authorization and unavailable states.
- Confirm that no network request originates from the report extension.

This is an integration scaffold, not a claim that Apple entitlement approval or production distribution is complete.
