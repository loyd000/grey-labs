# Repair attempt 1

Fixed the validated hero gap with a desktop grid: actions end near 809px at 1440×1000. Preserved the headline and right-side native workspace.

The work project overview retains three project/status records in a landscape frame (about 850×500 desktop, 352×212 compact). Filters, priorities, and activity remain available in a native disclosure, and the selected project track follows its natural height. This is a bounded content adaptation authorized by the visual finding; approved artifacts and reference IDs remain unchanged.

About heading and prose now share 34px desktop and 24px compact editorial type. Section labels use normal-case Instrument Sans at 18px desktop and 16px compact; interface metadata remains monospace. The skip link retains its full target box off canvas and appears on keyboard focus.

Verification: node --check script.js; node .taste/check-current.cjs; node .taste/check-repair.cjs all passed. Chromium direct-file checks cover 320, 390, 768, 1024, and 1440px, 200% CSS zoom, all target sizes including the skip link, keyboard controls, local filters, workflow selection, project navigation, script-free visibility, and disabled inquiry behavior. Actual browser evidence confirms hero entrance, work reveal, distinct About reveal, process emphasis, reduced-motion startup and preference changes, restored middle scroll, resize, and two rapid down/up scroll laps without invisible content or reveal replay. Desktop hero, desktop work, and compact work/About were visually inspected after repairs.

Verify before publishing: Operations workspace and Connected workflows are concept studies with representative project, task, status, field, destination, and notification values. Inquiry endpoint remains empty and sending disabled. Hosted-preview and real-device checks remain unverified. No server was started, dependencies installed, or approved artifacts edited.
