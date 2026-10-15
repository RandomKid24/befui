## UI components (befui for Flutter)

This app uses [befui](https://github.com/RandomKid24/befui) for Flutter: copy-paste widgets (one Dart file each, in `lib/befui/`) with the same design as the befui React components.

Rules:
- Before building any UI, check whether a befui widget exists: https://raw.githubusercontent.com/RandomKid24/befui/main/public/llms-flutter.txt (every widget with a working example). Browse them on the docs site too, in the Flutter section of each component page.
- Add a widget with the CLI, never by retyping it: `npx github:RandomKid24/befui add <name> --flutter` (run in the folder with pubspec.yaml). It also copies the shared `theme.dart`, `core.dart` and `icons.dart` when needed.
- Theme once in MaterialApp: `theme: BefTheme.data()`, `darkTheme: BefTheme.data(brightness: Brightness.dark)`. Read colours with `context.bef.primary` (never hard-code colours), text with `BefText.style(context, size: 14)`, icons with `BefIcon(BefIcons.search)`.
- If a befui MCP server is connected, use `get_component` with `format: "flutter"` and `get_flutter_rules` instead of guessing.
- Edit the copied files freely; they belong to this app. `add <name> --flutter --force` overwrites local edits.
