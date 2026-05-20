---
description: Run NAV tie-out — recompute an LP's capital account from the NAV pack and flag mismatches before the LP statement is distributed.
---

Run the `nav-tieout` skill on the current period's NAV pack and LP statement.

- Pull NAV pack inputs from the configured fund admin connector (or attached files if no connector).
- Recompute LP capital account per the standard waterfall (beginning + contributions − distributions + allocated income − carry).
- Compare line by line, tolerance `0.01`.
- Output: pass/fail per line, recomputed values, flag list. Do not edit the statement.

The publisher acts on flags after review. This command produces evidence, not a sign-off.
