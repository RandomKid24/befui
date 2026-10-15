import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/card.dart';
import '../befui/loader.dart';
import '../befui/skeleton.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      final c = context.bef;
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              for (final v in BefLoaderVariant.values)
                Container(
                  width: 88,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(BefRadius.lg),
                    border: Border.all(color: c.border),
                  ),
                  child: Column(
                    children: [
                      BefLoader(variant: v),
                      const SizedBox(height: 8),
                      Text(v.name, style: BefText.style(context, size: 11, color: c.mutedForeground)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 24),
          const BefBarLoader(),
          const SizedBox(height: 12),
          const BefBarLoader(value: 64),
          const SizedBox(height: 24),
          Align(
            alignment: Alignment.centerLeft,
            child: BefButton(
              label: _loading ? 'Stop loading' : 'Reload report',
              size: BefButtonSize.sm,
              variant: BefButtonVariant.outline,
              onPressed: () => set(() => _loading = !_loading),
            ),
          ),
          const SizedBox(height: 24),
          BefLoadingOverlay(
            loading: _loading,
            label: 'Fetching report',
            variant: BefLoaderVariant.orbit,
            child: const BefCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BefCardHeader(children: [BefCardTitle('Monthly revenue')]),
                  Padding(
                    padding: EdgeInsets.fromLTRB(20, 0, 20, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        BefSkeleton(width: 100, height: 24),
                        SizedBox(height: 8),
                        BefSkeleton(height: 16),
                        SizedBox(height: 8),
                        BefSkeleton(width: 220, height: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    },
  );
}

bool _loading = true;
