// Every gallery example builds in light and dark without errors (a RenderFlex overflow fails the test too).
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:befui_flutter/gallery/registry.dart';

import 'support.dart';

void main() {
  setUpAll(loadInter);
  for (final e in entries) {
    for (final b in Brightness.values) {
      testWidgets('${e.slug} builds in ${b.name}', (tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 900));
        await tester.pumpWidget(framed(e.example, brightness: b));
        await tester.pump(const Duration(milliseconds: 300));
        expect(tester.takeException(), isNull);
      });
      if (e.preview != null) {
        testWidgets('${e.slug} preview builds in ${b.name}', (tester) async {
          await tester.binding.setSurfaceSize(const Size(390, 900));
          await tester.pumpWidget(framed(e.preview!, brightness: b));
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });
      }
    }
  }
}
