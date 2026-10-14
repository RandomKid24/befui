import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:befui_flutter/befui/theme.dart';

/// Loads the bundled Inter weights so text renders like the docs site instead of the test font.
Future<void> loadInter() async {
  final loader = FontLoader('Inter');
  for (final w in ['Regular', 'Medium', 'SemiBold', 'Bold']) {
    loader.addFont(
      Future.value(
        ByteData.sublistView(
          File('assets/fonts/Inter-$w.ttf').readAsBytesSync(),
        ),
      ),
    );
  }
  await loader.load();
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
                padding: const EdgeInsets.all(20),
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
