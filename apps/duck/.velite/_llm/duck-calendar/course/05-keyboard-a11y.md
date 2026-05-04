}>

**Lesson 5 of 8**: how the calendar handles keyboard input and ARIA semantics, so the date picker is accessible by default.

## Built-in keyboard navigation

`getDayProps` attaches an `onKeyDown` handler that implements the full WAI-ARIA grid keyboard pattern:

| Key | Action |
| :--- | :--- |
| 

)
```

---

## Testing accessibility

Test keyboard navigation with <Kbd>Tab</Kbd> and arrow keys. Check screen reader output with VoiceOver (macOS) or NVDA (Windows).

Things to verify:

- The grid announces as "calendar" when focused.
- Each day announces its full date.
- Selected days announce "selected".
- Month changes are announced.
- Disabled days announce as disabled.

}>

Next: [Lesson 6 - Time Picker](/duck-calendar/course/06-time-picker)