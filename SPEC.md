# Time Tracker — Version 1 Spec

## Goal
A single-page app where I can record time spent on projects, either live with a
timer or by typing it in afterward.

## User can
- Create a project with a name and a color.
- Start a timer with a description and a project, then stop it. While running,
  the elapsed time updates every second.
- Add a past entry manually: description, project, date, and start + end time.
- See a list of all entries, newest first, showing description, project (with
  its color), start–end time, and duration.
- Delete an entry.

## A time entry has
- Description (text, can be empty)
- Project (optional — an entry can have no project)
- Start time
- End time
- Duration — calculated from start and end, never typed in separately

## A project has
- Name (required, unique)
- Color (picked from a small fixed palette of ~8 colors)

## Data
- Saved in the browser (localStorage). Refreshing the page keeps everything.
- If a timer is running and I refresh, it keeps running from the original
  start time.

## Done when
- I can create a project, start a timer, stop it, and see the entry in the list
  with the correct duration.
- I can add a manual entry for yesterday and it appears in the right place in
  the list.
- After refreshing the page, my projects, entries, and a running timer are all
  still there.
- Entering an end time earlier than the start time shows an error and saves
  nothing.

## Not in this version
- Editing entries or projects (delete only)
- Deleting projects
- Clients, tags, billable rates
- Reports, totals, charts
- Login, accounts, multiple users
- A real database or backend
- Mobile-specific design (it should still be usable on a phone)
