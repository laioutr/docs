Read the StudioIcon source file at `@apps/cockpit/src/features/project/studio/ui/atom/StudioIcon.tsx` and the docs component at `app/components/StudioIconGrid.vue`.

Compare the `StudioIconMap` keys in StudioIcon.tsx against the icon entries in StudioIconGrid.vue. For each key in StudioIconMap that is missing from the docs component, add it to the appropriate section in StudioIconGrid.vue:

- Lucide icons (`Lu*`): use `lucide:kebab-case-name` format
- Tabler icons (`Tb*`): use `tabler:kebab-case-name` format
- Material Design icons (`Md*`): use `material-symbols:kebab-case-name` format
- Bootstrap icons (`Bs*`): use `bi:kebab-case-name` format
- Ionicons (`IoMd*`): use `ion:kebab-case-name` format

Section assignment rules:
- Icons named `border*` go in "Borders"
- Icons named `box*` go in "Box Styles"
- Icons named `align*` go in "Alignment"
- Icons named `layout*`, `template`, `section`, `globalSection`, `block`, `container`, `masonry` go in "Structure"
- Everything else goes in "Pages & Content"

Only add a `hint` property if the icon name alone doesn't make the purpose obvious.

Also report any icons present in StudioIconGrid.vue that were removed from StudioIconMap, and remove them.
