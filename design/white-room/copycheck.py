#!/usr/bin/env python3
"""White Room copy + href gate for lifetime.elaye.store.

  python3 design/white-room/copycheck.py --baseline   # once, in W0: snapshot main's index.html
  python3 design/white-room/copycheck.py              # every step: check the working index.html

Rules (case-sensitive; headings keep their live UPPERCASE source text, the
comps' lowercase comes from CSS text-transform, never from rewriting text):
  1. Every text node of main must still appear in the new page, unless it is
     listed in allowlist.json "retired" (duplicates and retired UI only).
  2. Every text node of the new page must exist in main's text, or be listed
     in allowlist.json "new_ui" (the comp's header, footer and label strings).
  3. The set of <a href> targets must equal main's, plus allowlist "new_hrefs"
     and in-page #anchors. Every [data-checkout] must carry the Stripe href.
  4. No em dash, no emoji, no purple and no font other than Geist that main
     did not already have (member quotes keep their original emoji).
Prints PASS or FAIL with the exact offending strings.
"""
import json, re, subprocess, sys, pathlib
from html.parser import HTMLParser

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
BASE = HERE / "baseline.json"
ALLOW = json.loads((HERE / "allowlist.json").read_text())

class P(HTMLParser):
    SKIP = {"script", "style", "template"}
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.texts, s.hrefs, s.checkout, s.alts, s.stack = [], [], [], [], []
    def handle_starttag(s, tag, attrs):
        a = dict(attrs)
        if tag not in ("br", "img", "meta", "link", "input", "source", "hr", "wbr"):
            s.stack.append(tag)
        if tag == "a" and a.get("href") is not None:
            s.hrefs.append(a["href"])
            if "data-checkout" in a: s.checkout.append(a["href"])
        if tag == "img" and a.get("alt"): s.alts.append(norm(a["alt"]))
        if tag == "title": s.stack.append("title!")
    def handle_endtag(s, tag):
        while s.stack:
            t = s.stack.pop()
            if t == tag: break
    def handle_data(s, d):
        if any(t in s.SKIP for t in s.stack): return
        d = norm(d)
        if d: s.texts.append(d)

def norm(x): return re.sub(r"\s+", " ", x.replace(" ", " ")).strip()

def parse(html):
    p = P(); p.feed(html); return p

def snapshot(html):
    p = parse(html)
    return {"texts": p.texts, "hrefs": sorted(set(p.hrefs)), "alts": p.alts}

EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿\U0001F000-\U0001F2FF]")
PURPLE = re.compile(r"#(?:7c3aed|8b5cf6|a855f7|9333ea|6d28d9|a78bfa|c084fc|800080|8a2be2|9370db)\b|\bpurple\b|\bviolet\b", re.I)

def main():
    if "--baseline" in sys.argv:
        html = subprocess.check_output(["git", "-C", str(ROOT), "show", "main:index.html"], text=True)
        BASE.write_text(json.dumps(snapshot(html), indent=1, ensure_ascii=False))
        print(f"baseline written from main:index.html -> {BASE}"); return
    base = json.loads(BASE.read_text())
    new_html = (ROOT / "index.html").read_text()
    new = parse(new_html)
    base_full = " ‖ ".join(base["texts"])
    new_full = " ".join(new.texts)
    fails = []
    retired = set(ALLOW["retired"])
    for t in dict.fromkeys(base["texts"]):
        if t in retired: continue
        if t not in new_full: fails.append(f"MISSING live copy: {t!r}")
    new_ui = set(ALLOW["new_ui"])
    for t in dict.fromkeys(new.texts):
        if t in new_ui: continue
        if t not in base_full: fails.append(f"NEW/CHANGED copy not on main: {t!r}")
    bh = {h for h in base["hrefs"] if not h.startswith("#")}
    nh = {h for h in new.hrefs if not h.startswith("#")}
    allowed_new = set(ALLOW["new_hrefs"])
    for h in sorted(bh - nh): fails.append(f"HREF removed: {h}")
    for h in sorted(nh - bh - allowed_new): fails.append(f"HREF added: {h}")
    stripe = ALLOW["stripe"]
    if not new.checkout: fails.append("no [data-checkout] links found")
    for h in new.checkout:
        if h != stripe: fails.append(f"checkout href changed: {h}")
    for a in ALLOW["keep_alts"]:
        if a not in new.alts: fails.append(f"kept screenshot missing (alt): {a!r}")
    base_emoji = set(EMOJI.findall(base_full))
    for t in new.texts:
        if "—" in t: fails.append(f"em dash: {t!r}")
        for e in EMOJI.findall(t):
            if e not in base_emoji: fails.append(f"emoji: {t!r}")
    css = re.sub(r'"data:[^"]*"', '""', new_html) + "".join(p.read_text(errors="ignore") for p in (ROOT / "css").glob("*.css"))
    if PURPLE.search(css): fails.append(f"purple found: {PURPLE.search(css).group(0)}")
    for f in ("Montserrat", "Barlow", "Inter", "Roboto", "Arial", "Bebas", "Instrument Sans"):
        if re.search(rf"font-family[^;{{}}]*\b{f}\b|family={f}\b", css): fails.append(f"font still referenced: {f}")
    if fails:
        print("FAIL"); [print(" -", f) for f in fails]; sys.exit(1)
    print(f"PASS  ({len(set(base['texts']))} live text nodes kept, hrefs identical, {len(new.checkout)} checkout links on Stripe)")

if __name__ == "__main__": main()
