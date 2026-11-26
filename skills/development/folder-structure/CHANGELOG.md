# Changelog

## 0.11.0 -- 2026-11-26 candidate update

- Added `references/storage.md`: the three stores a project needs and what each must give, provider-neutral; the mount rules; the archive naming rule for a superseded document (dated day folder, the file's own path, a per-day `MANIFEST.sha256` of the old bytes, permissions as the share gives them, nothing deleted by the writer).
- Corrected a claim the earlier storage text carried: share-level soft delete protects the **share**, not the files in it. Recovering an individually deleted file needs a retained snapshot or another backup; an individually deleted snapshot is outside share soft delete.
- `SKILL.md` points at the new reference from the storage section and carries the correction in one line.

## 0.9.1 -- 2026-11-22 candidate update

- Added the plain-language human guide as `references/human-guide.md`, linked from `SKILL.md` and the repository README. The guide explains the existing rules and changes none of them.

## 0.9.0 -- 2026-11-22 candidate update

- Added a portable four-turn clean-up method with explicit holding, consumer, manifest, and count checks.
- Added the product wireframes area and its editable source, rendered image, and index to the starter definition and template.
