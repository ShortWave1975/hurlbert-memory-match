# Hurlbert Memory Match – Backlog

_Last updated: 2025-11-01_

## 0. Current State
- App is deployed on **Vercel** from GitHub (`main`).
- Layout is now **centered** on desktop.
- Mobile portrait uses **3 columns** (narrow phones drop a bit).
- **Intro overlay** + **sound toggle** exist in the current code (we experimented with them).
- We **did NOT like** the “difficulty indicator above the board” change, and we rolled back / plan to revert the commit:
  - Commit to discard: **"Added Difficulty Indicator Feature"**.
  - Next time: confirm in GitLens that the revert was pushed.

---

## 1. Must-Do Next Session
1. **Confirm Git state**
   - [ ] Open GitLens → Commits → verify that **“Revert ‘Added Difficulty Indicator Feature’”** exists on `main`.
   - [ ] If not, run the GUI revert again on that commit and push.
   - [ ] Confirm Vercel redeployed from the reverted commit.

2. **Clean up intro overlay**
   - [ ] Decide: keep intro ONCE per device (current behavior) or make it a footer link (“Show help”).
   - [ ] If we remove it, delete: `showIntro`, `localStorage hm_seenIntro`, and the `<div className="intro-overlay"> ...`.

---

## 2. Nice-to-Haves (UI/UX)
- [ ] **Win screen polish**: add small confetti / “Personal best!” label if moves/time improved.
- [ ] **Footer note**: “Made for the Hurlberts · Christmas 2025” (desktop only).
- [ ] **Better tiny screens** (<360px): tighten card gap + reduce header padding.
- [ ] **Snow performance**: reduce flakes on mobile (<700px) to improve smoothness.

---

## 3. Gameplay / Features (Future)
- [ ] **Rematch with same photos** (current reset reshuffles faces).
- [ ] **Stats in localStorage**:
  - best time per difficulty
  - fewest moves per difficulty
  - last played difficulty
- [ ] **Admin / family mode**: optional route or query param to load a different photo folder.

---

## 4. Tech / Repo
- [ ] Add this `BACKLOG.md` to repo root and commit.
- [ ] Add a short `DEPLOYING.md`:
  - `git add . && git commit -m "..." && git push`
  - Vercel auto-deploys on push
  - how to revert in GitLens (1–2 lines)
- [ ] (Optional) add `.vscode/settings.json` to enforce prettier / 2 spaces / LF.

---

## 5. Known/Lower-Priority Issues
- [ ] Desktop centering sometimes looks off if browser cached old CSS — hard refresh fixes it; could force CSS version bump.
- [ ] Snow sits above some elements on very short viewports — z-index audit later.
- [ ] Wide landscape phones: grid can get slightly tall; consider 4 cols at ~680–750px.

---

## 6. Notes for Future ChatGPT Sessions
- Project name: **hurlbert-memory-match**
- Built with **Vite + React**
- Important files:
  - `src/App.jsx`
  - `src/App.css`
  - `src/components/card.jsx`
  - `src/components/card.css`
  - `src/data/deck.js`
- Images live in: **`/public/photos/family/`** and filenames must match `DEFAULT_FILES` in `deck.js`
- Deploy target: **Vercel**, from **GitHub main**

---
