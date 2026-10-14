import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/theme.dart';
import 'registry.dart';

/// The befui gallery: every Flutter widget with its example, a light/dark switch and the ten palettes of the Themes page.
class GalleryApp extends StatefulWidget {
  const GalleryApp({super.key, this.initial});

  /// Open straight on a component (used by screenshots and tests).
  final String? initial;

  @override
  State<GalleryApp> createState() => _GalleryAppState();
}

class _GalleryAppState extends State<GalleryApp> {
  ThemeMode mode = ThemeMode.system;
  BefPalette palette = BefPalette.blue;

  @override
  Widget build(BuildContext context) {
    final nav = GlobalKey<NavigatorState>();
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'befui for Flutter',
      navigatorKey: nav,
      theme: BefTheme.data(brightness: Brightness.light, palette: palette),
      darkTheme: BefTheme.data(brightness: Brightness.dark, palette: palette),
      themeMode: mode,
      home: _Index(
        mode: mode,
        palette: palette,
        onMode: (m) => setState(() => mode = m),
        onPalette: (p) => setState(() => palette = p),
        initial: widget.initial,
      ),
    );
  }
}

class _Index extends StatefulWidget {
  const _Index({
    required this.mode,
    required this.palette,
    required this.onMode,
    required this.onPalette,
    this.initial,
  });
  final ThemeMode mode;
  final BefPalette palette;
  final ValueChanged<ThemeMode> onMode;
  final ValueChanged<BefPalette> onPalette;
  final String? initial;

  @override
  State<_Index> createState() => _IndexState();
}

class _IndexState extends State<_Index> {
  String q = '';

  @override
  void initState() {
    super.initState();
    final slug = widget.initial;
    if (slug != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final e = entries.firstWhere((e) => e.slug == slug);
        Navigator.of(
          context,
        ).push(MaterialPageRoute<void>(builder: (_) => _Detail(e)));
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final shown = entries
        .where(
          (e) =>
              '${e.name} ${e.category}'.toLowerCase().contains(q.toLowerCase()),
        )
        .toList();
    final cats = <String>{for (final e in shown) e.category};
    return Scaffold(
      backgroundColor: c.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
          children: [
            Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: c.primary,
                    borderRadius: BorderRadius.circular(BefRadius.md),
                  ),
                  alignment: Alignment.center,
                  child: BefIcon(
                    BefIcons.befMark,
                    size: 16,
                    color: c.primaryForeground,
                    weight: 2.2,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  'befui',
                  style: BefText.style(
                    context,
                    size: 18,
                    weight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                _ModeButton(mode: widget.mode, onMode: widget.onMode),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              'Flutter components',
              style: BefText.style(
                context,
                size: 28,
                weight: FontWeight.w600,
                letterSpacing: -0.6,
                height: 1.15,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '${entries.length} widgets so far, same design as the React ones.',
              style: BefText.style(context, color: c.mutedForeground),
            ),
            const SizedBox(height: 16),
            TextField(
              onChanged: (v) => setState(() => q = v),
              decoration: InputDecoration(
                hintText: 'Filter components',
                hintStyle: BefText.style(context, color: c.mutedForeground),
                prefixIcon: const Padding(
                  padding: EdgeInsets.all(12),
                  child: BefIcon(BefIcons.search, size: 16),
                ),
                isDense: true,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(BefRadius.md),
                  borderSide: BorderSide(color: c.input),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(BefRadius.md),
                  borderSide: BorderSide(color: c.ring),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 32,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  for (final p in BefPalette.all)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => widget.onPalette(p),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(BefRadius.full),
                            border: Border.all(
                              color: p == widget.palette
                                  ? p.light.primary
                                  : c.border,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: p.light.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                p.label,
                                style: BefText.style(
                                  context,
                                  size: 12,
                                  weight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            for (final cat in cats) ...[
              Padding(
                padding: const EdgeInsets.only(top: 24, bottom: 8),
                child: Text(
                  cat.toUpperCase(),
                  style: BefText.style(
                    context,
                    size: 11,
                    weight: FontWeight.w600,
                    color: c.mutedForeground,
                    letterSpacing: 0.9,
                  ),
                ),
              ),
              for (final e in shown.where((e) => e.category == cat))
                InkWell(
                  borderRadius: BorderRadius.circular(BefRadius.md),
                  onTap: () => Navigator.of(
                    context,
                  ).push(MaterialPageRoute<void>(builder: (_) => _Detail(e))),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      vertical: 12,
                      horizontal: 4,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                e.name,
                                style: BefText.style(
                                  context,
                                  weight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                e.description,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: BefText.style(
                                  context,
                                  size: 13,
                                  color: c.mutedForeground,
                                ),
                              ),
                            ],
                          ),
                        ),
                        BefIcon(
                          BefIcons.chevronRight,
                          size: 16,
                          color: c.mutedForeground,
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ModeButton extends StatelessWidget {
  const _ModeButton({required this.mode, required this.onMode});
  final ThemeMode mode;
  final ValueChanged<ThemeMode> onMode;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return IconButton(
      onPressed: () => onMode(dark ? ThemeMode.light : ThemeMode.dark),
      icon: BefIcon(dark ? BefIcons.sun : BefIcons.moon, size: 18),
      tooltip: 'Toggle theme',
    );
  }
}

class _Detail extends StatelessWidget {
  const _Detail(this.entry);
  final GalleryEntry entry;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Scaffold(
      backgroundColor: c.background,
      appBar: AppBar(
        backgroundColor: c.background,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        title: Text(
          entry.name,
          style: BefText.style(context, size: 16, weight: FontWeight.w600),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Divider(height: 1, color: c.border),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            entry.description,
            style: BefText.style(context, color: c.mutedForeground),
          ),
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: c.background,
              border: Border.all(color: c.border),
              borderRadius: BorderRadius.circular(BefRadius.xl),
            ),
            child: entry.example(context),
          ),
        ],
      ),
    );
  }
}
