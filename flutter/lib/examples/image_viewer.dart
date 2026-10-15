import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/image_viewer.dart';
import '../befui/theme.dart';

/// A plain coloured picture, so the example needs no files or network.
ImageProvider _art(Color bg) {
  final px = Uint8List.fromList([bg.r * 255, bg.g * 255, bg.b * 255, 255].map((v) => v.round()).toList());
  return MemoryImage(_bmp(px));
}

Uint8List _bmp(Uint8List rgba) {
  // 1x1 24-bit BMP, stretched by Image.fit
  final b = ByteData(58);
  b.setUint8(0, 0x42);
  b.setUint8(1, 0x4D);
  b.setUint32(2, 58, Endian.little);
  b.setUint32(10, 54, Endian.little);
  b.setUint32(14, 40, Endian.little);
  b.setInt32(18, 1, Endian.little);
  b.setInt32(22, 1, Endian.little);
  b.setUint16(26, 1, Endian.little);
  b.setUint16(28, 24, Endian.little);
  b.setUint8(54, rgba[2]);
  b.setUint8(55, rgba[1]);
  b.setUint8(56, rgba[0]);
  return b.buffer.asUint8List();
}

Widget example(BuildContext context) {
  final images = [
    BefViewerImage(image: _art(const Color(0xFFE0E7FF)), alt: 'Office floor plan'),
    BefViewerImage(image: _art(const Color(0xFFFCE7F3)), alt: 'Brand moodboard'),
    BefViewerImage(image: _art(const Color(0xFFDCFCE7)), alt: 'Event photos'),
  ];
  return _groups(context, [
    (
      'Tap a tile, swipe, pinch or double-tap to zoom',
      Row(
        children: [
          for (var i = 0; i < images.length; i++)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () => showBefImageViewer(context: context, images: images, initialIndex: i),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: SizedBox(
                    width: 72,
                    height: 72,
                    child: Image(image: images[i].image, fit: BoxFit.cover),
                  ),
                ),
              ),
            ),
        ],
      ),
    ),
    (
      'Or from a button',
      BefButton(
        label: 'Open the first photo',
        variant: BefButtonVariant.outline,
        onPressed: () => showBefImageViewer(context: context, images: images),
      ),
    ),
  ]);
}

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
