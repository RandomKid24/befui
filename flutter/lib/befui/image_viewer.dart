import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

class BefViewerImage {
  const BefViewerImage({required this.image, required this.alt});
  final ImageProvider image;
  final String alt;
}

/// Full-screen photo viewer: swipe between images, pinch or double-tap to zoom, tap the x or swipe down to close. Returns when closed.
Future<void> showBefImageViewer({
  required BuildContext context,
  required List<BefViewerImage> images,
  int initialIndex = 0,
}) {
  return Navigator.of(context, rootNavigator: true).push(
    PageRouteBuilder<void>(
      opaque: false,
      barrierColor: Colors.black.withValues(alpha: 0.92),
      transitionDuration: const Duration(milliseconds: 200),
      pageBuilder: (context, a, b) => FadeTransition(
        opacity: a,
        child: _Viewer(images: images, initial: initialIndex),
      ),
    ),
  );
}

class _Viewer extends StatefulWidget {
  const _Viewer({required this.images, required this.initial});
  final List<BefViewerImage> images;
  final int initial;
  @override
  State<_Viewer> createState() => _ViewerState();
}

class _ViewerState extends State<_Viewer> {
  late final _page = PageController(initialPage: widget.initial);
  late int _i = widget.initial;
  final _controllers = <int, TransformationController>{};
  bool _zoomed = false;

  TransformationController _tc(int i) => _controllers.putIfAbsent(i, () => TransformationController());

  @override
  void dispose() {
    _page.dispose();
    for (final t in _controllers.values) {
      t.dispose();
    }
    super.dispose();
  }

  void _doubleTap(int i) {
    final t = _tc(i);
    final zoomed = t.value.getMaxScaleOnAxis() > 1.01;
    t.value = zoomed ? Matrix4.identity() : Matrix4.diagonal3Values(2.5, 2.5, 1);
    setState(() => _zoomed = !zoomed);
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Stack(
        children: [
          GestureDetector(
            onVerticalDragEnd: (d) {
              if (!_zoomed && (d.primaryVelocity ?? 0) > 400) Navigator.of(context).pop();
            },
            child: PageView.builder(
              controller: _page,
              physics: _zoomed ? const NeverScrollableScrollPhysics() : null,
              itemCount: widget.images.length,
              onPageChanged: (n) => setState(() {
                _i = n;
                _zoomed = false;
              }),
              itemBuilder: (context, i) => GestureDetector(
                onDoubleTap: () => _doubleTap(i),
                child: InteractiveViewer(
                  transformationController: _tc(i),
                  minScale: 1,
                  maxScale: 5,
                  onInteractionEnd: (_) => setState(() => _zoomed = _tc(i).value.getMaxScaleOnAxis() > 1.01),
                  child: Center(
                    child: Semantics(
                      label: widget.images[i].alt,
                      image: true,
                      child: Image(image: widget.images[i].image, fit: BoxFit.contain),
                    ),
                  ),
                ),
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Text(
                    '${_i + 1} / ${widget.images.length}',
                    style: BefText.style(context, size: 13, color: Colors.white70),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Semantics(
                      button: true,
                      label: 'Close',
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: const BoxDecoration(color: Color(0x1FFFFFFF), shape: BoxShape.circle),
                        child: const Center(child: BefIcon(BefIcons.x, size: 20, color: Colors.white)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  widget.images[_i].alt,
                  textAlign: TextAlign.center,
                  style: BefText.style(context, color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
