{{flutter_js}}
{{flutter_build_config}}

// One CanvasKit build for every browser, so only one 6.8 MB wasm file has to ship with the docs site.
_flutter.loader.load({
  config: { renderer: 'canvaskit', canvasKitVariant: 'full' },
});
