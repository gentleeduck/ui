---
title: Badge Changelog
description: Updates and improvements to the Badge component.
---

## Changelog

### 2025-02-14 **Enhanced Badge Variants & Customization Options**

The `badgeVariants` utility has been **significantly expanded** to provide more **customization, improved accessibility, and flexibility**.

### 🆕 **What's New?**

- **🚀 New Variants Added**

  - `warning`: A dedicated warning variant with proper foreground and background contrast.
  - `dashed`: A **border-dashed** variant for subtle emphasis.
  - `nothing`: A minimalist variant with **no padding**.

- **🎨 New Border Styles**

  - `primary`, `secondary`, `destructive`, and `warning` border options provide **better differentiation and hover effects**.

- **🔍 Improved Size Options**
  - `sm`, `lg`, and `icon` sizes ensure better adaptability across different UI elements.

### 🔄 **Changes & Improvements**

- **Refactored Structure**

  - The new version removes unnecessary `border-transparent` definitions and improves **hover effects**.
  - More consistent `text-foreground` usage across variants.

- **Better Accessibility & Focus Styles**
  - Ensures all variants retain **focus indicators** for better **keyboard navigation**.

### 🔥 **Migration Notes**

- If you're using the **old `outline` variant**, it now has improved text contrast.
- If you need **bordered badges**, use the new `border` options instead of relying on manual styles.
- New `warning` and `dashed` variants provide better UX for emphasis.

---

This update makes the badge system **more modular and customizable**, improving usability across different design needs. 🚀
