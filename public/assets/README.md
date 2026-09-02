# Client assets

Drop the client's real files at the **exact paths below** — every image slot on the site
already points here, so nothing needs renaming and no code has to change. Until a file
exists, its slot renders a labelled "client asset pending" panel.

Run `npm run check:content` at any time to list which slots are still empty.

## Hero (homepage)
```
hero/hero-video-1.mp4   hero/hero-image-1.jpg
hero/hero-video-2.mp4   hero/hero-image-2.jpg
hero/hero-video-3.mp4   hero/hero-image-3.jpg
```
The image doubles as the video poster and the fallback when a video is missing, blocked
by low-power mode, or when the visitor prefers reduced motion — so the images are
required even if videos are supplied.

## Treatments
One card image and one hero image per treatment slug (13 of each):
```
treatments/treatment-{slug}.jpg          # card, 4:5 portrait
treatments/treatment-{slug}-hero.jpg     # detail page, 4:5 portrait
```
Slugs are listed in `data/treatments.ts`, e.g. `treatment-dermaplaning.jpg`.

## Before / after
Consented clinical photography only — no stock, no scraped images.
```
before-after/treatment-{slug}-results-before.jpg
before-after/treatment-{slug}-results-after.jpg
before-after/before-after-{1..6}-before.jpg    # homepage + gallery grid
before-after/before-after-{1..6}-after.jpg
```
Shoot both frames at the same distance, lighting and white balance — the comparison
slider crops them identically, and any exposure shift between frames reads as a fake.

## Story, team, brand
```
story/philosophy-story.jpg      # 4:5 portrait
team/team-photo-{1..3}.jpg      # 3:4 portrait
brand/logo-light.svg            # for forest-green nav/footer
brand/logo-dark.svg             # for cream sections
favicon.ico                     # place in /app, not here
```

## Notes
- All photography is displayed on cream/off-white grounds only.
- Icons come from `lucide-react`, so no icon files are needed.
