import 'package:flutter/material.dart';

import 'gallery/gallery_app.dart';

/// The gallery. On the web, `?w=button&theme=dark` shows that one widget alone, which is what the docs site embeds in its phone frame.
void main() {
  final q = Uri.base.queryParameters;
  runApp(GalleryApp(embed: q['w'], embedDark: q['theme'] == 'dark', embedBare: q['mode'] == 'widget'));
}
