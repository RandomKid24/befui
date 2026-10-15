import 'dart:js_interop';

extension type _Win._(JSObject _) implements JSObject {
  external void postMessage(JSAny? message, String targetOrigin);
}

@JS('window.parent')
external _Win get _parent;

/// Tells the page that embeds the web build how tall the widget is.
void reportHeight(double height) => _parent.postMessage({'befui': 'height', 'value': height}.jsify(), '*');
