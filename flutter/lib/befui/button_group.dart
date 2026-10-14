import 'package:flutter/material.dart';

import 'button.dart';

/// Joins buttons into one row: shared borders and only the outer corners round. Give it [BefButton]s; it sets their [BefButtonJoin].
class BefButtonGroup extends StatelessWidget {
  const BefButtonGroup({super.key, required this.children});
  final List<BefButton> children;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < children.length; i++)
            BefButton(
              key: children[i].key,
              label: children[i].label,
              leading: children[i].leading,
              trailing: children[i].trailing,
              onPressed: children[i].onPressed,
              variant: children[i].variant,
              size: children[i].size,
              shape: children[i].shape,
              loading: children[i].loading,
              semanticLabel: children[i].semanticLabel,
              join: children.length == 1
                  ? BefButtonJoin.none
                  : (i == 0
                        ? BefButtonJoin.start
                        : (i == children.length - 1 ? BefButtonJoin.end : BefButtonJoin.middle)),
              child: children[i].child,
            ),
        ],
      ),
    );
  }
}
