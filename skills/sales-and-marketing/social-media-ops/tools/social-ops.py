#!/usr/bin/env python3
"""Entry point for the bundled social_ops toolkit: python3 tools/social-ops.py --help"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from social_ops.cli import main  # noqa: E402

if __name__ == "__main__":
    sys.exit(main())
