import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:befui_flutter/befui/icons.dart';
import 'package:befui_flutter/befui/theme.dart';
import 'package:befui_flutter/gallery/registry.dart';

/// Loads the bundled Inter weights so text renders like the docs site instead of the test font.
Future<void> loadInter() async {
  final loader = FontLoader('Inter');
  for (final w in ['Regular', 'Medium', 'SemiBold', 'Bold']) {
    loader.addFont(Future.value(ByteData.sublistView(File('assets/fonts/Inter-$w.ttf').readAsBytesSync())));
  }
  await loader.load();
  // JetBrains Mono is not bundled (2.5 MB a weight). Pick it up from the machine when it is installed, so code in previews matches the site.
  final home = Platform.environment['HOME'];
  final mono = File('$home/Library/Fonts/JetBrainsMonoNerdFont-Regular.ttf');
  if (home != null && mono.existsSync()) {
    final m = FontLoader('JetBrains Mono')
      ..addFont(Future.value(ByteData.sublistView(mono.readAsBytesSync())));
    await m.load();
  }
}

/// An example inside a themed [MaterialApp], on a card-like frame as wide as a phone.
Widget framed(
  Widget Function(BuildContext) example, {
  Brightness brightness = Brightness.light,
  double width = 390,
  BefPalette palette = BefPalette.blue,
  Key? boundary,
}) {
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: BefTheme.data(brightness: brightness, palette: palette),
    home: Builder(
      builder: (context) => Material(
        color: Theme.of(context).scaffoldBackgroundColor,
        child: SingleChildScrollView(
          child: Align(
            alignment: Alignment.topLeft,
            child: RepaintBoundary(
              key: boundary,
              child: Container(
                width: width,
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 44),
                color: Theme.of(context).scaffoldBackgroundColor,
                child: example(context),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/// An example as a full app screen (back arrow, title, description, the example in a bordered box), the way the gallery app shows it. At least phone height.
Widget screen(
  GalleryEntry entry,
  Widget Function(BuildContext) body, {
  Brightness brightness = Brightness.light,
  double width = 390,
  Key? boundary,
}) {
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: BefTheme.data(brightness: brightness),
    home: Builder(
      builder: (context) {
        final c = context.bef;
        return Material(
          color: c.background,
          child: SingleChildScrollView(
            child: Align(
              alignment: Alignment.topLeft,
              child: RepaintBoundary(
                key: boundary,
                child: Container(
                  width: width,
                  constraints: const BoxConstraints(minHeight: 760),
                  color: c.background,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        height: 52,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: c.border))),
                        child: Row(
                          children: [
                            BefIcon(BefIcons.chevronLeft, size: 22, color: c.foreground),
                            Expanded(
                              child: Text(entry.name, textAlign: TextAlign.center, style: BefText.style(context, size: 16, weight: FontWeight.w600)),
                            ),
                            const SizedBox(width: 22),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(entry.description, style: BefText.style(context, color: c.mutedForeground)),
                            const SizedBox(height: 16),
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: c.background,
                                border: Border.all(color: c.border),
                                borderRadius: BorderRadius.circular(BefRadius.xl),
                              ),
                              child: body(context),
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    ),
  );
}
