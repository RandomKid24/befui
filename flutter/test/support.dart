import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:befui_flutter/befui/theme.dart';

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
