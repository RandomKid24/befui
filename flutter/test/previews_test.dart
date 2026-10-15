// Renders every example to a PNG for the docs site: BEFUI_PREVIEWS=1 flutter test test/previews_test.dart  (writes ../public/flutter/<slug>-light.png and -dark.png)
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:befui_flutter/gallery/registry.dart';

import 'support.dart';

void main() {
  if (Platform.environment['BEFUI_PREVIEWS'] != '1') return;
  setUpAll(loadInter);
  final out = Directory('../public/flutter')..createSync(recursive: true);
  for (final e in entries) {
    for (final b in Brightness.values) {
      testWidgets('preview ${e.slug} ${b.name}', (tester) async {
        final key = GlobalKey();
        await tester.binding.setSurfaceSize(const Size(390, 1600));
        await tester.pumpWidget(framed(e.preview ?? e.example, brightness: b, boundary: key));
        await tester.pump(const Duration(milliseconds: 600));
        final boundary = tester.renderObject<RenderRepaintBoundary>(find.byKey(key));
        await tester.runAsync(() async {
          final image = await boundary.toImage(pixelRatio: 2);
          final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
          File('${out.path}/${e.slug}-${b.name}.png').writeAsBytesSync(bytes!.buffer.asUint8List());
        });
      });
    }
  }
}
