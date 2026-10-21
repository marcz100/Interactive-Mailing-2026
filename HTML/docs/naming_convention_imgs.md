# Email Image Naming Convention

* Use lowercase only.
* Use letters, numbers, and underscores (`_`) only.
* Do not use spaces, hyphens, camelCase, or other special characters.
* Keep names descriptive but concise.
* Use the same naming pattern consistently throughout the project.

## Formula

[brand][prefix_]{col_count}_col_{img_width}x{img_height}_{description}

* `brand` — optional, use when multiple (sub)brands are present
* `prefix` — optional, ties the image to a specific block role. Only used when the image belongs to a specialized block (`header`, `footer`, `close_alert`, `car`, `ham`, `hotspot`). Omit for images used in generic reusable blocks.
* `col_count` — number of columns in the block the image will sit in (`1_col`, `2_col`, `3_col`...). Tells you at a glance which generic or specific block this image is meant for.
* `img_width x img_height` — actual exported pixel dimensions of the image, e.g. `600x400`.
* `description` — plain-word description of what the image shows. Always last.

## Use Cases

**Generic block, no country variant**
```
1_col_600x150_logo
2_col_300x300_product_shoe_red
3_col_200x200_icon_star
```

**Specific/specialized block (prefix included)**
```
header_1_col_600x150_logo
footer_1_col_40x40_social_icon
close_alert_1_col_800x200_alert_icon
car_1_col_1200x600_slide_summer_sale
hotspot_1_col_600x400_map_overview
```