---
module_id: "<stable-module-id>"
owner: "<project account or role reference>"
source_paths: []
state: planned
release: "<release-id>"
---

# {{module_id}}

## 1. Purpose

<One sentence: what this module does for the product.>

## 2. Interface

<Operations, inputs, results, errors, limits, and call order. Describe what callers need, not internal implementation.>

## 3. Picture

<Link the numbered diagram and its legend.>

## 4. Parts

| Part | Purpose | Source location | State | Progress |
|---|---|---|---|---|
| <part-id> | <purpose> | <source path> | <state> | <recorded progress> |

## 5. Dependencies and callers

- Depends on: <module ids>
- Used by: <module ids>

## 6. How it is tested

<Describe checks through the module's public interface.>

## 7. Decisions

<Link only surprising or hard-to-reverse decisions.>

## 8. State

<Generated from the canonical progress data; do not hand-edit.>
