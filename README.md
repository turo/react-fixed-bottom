# react-fixed-bottom

> React component to make fixed:bottom styles usable in Safari mobile.

## Features

- Set the CSS properties of the wrapped children to:

```javascript
{
  position: 'fixed';
  bottom: offset;
}
```

- Safari mobile user agent detection
- Reacts to Safari mobile overflow bar display. If the bar hides a fixed bottom element,
  it is repositioned so it becomes visible in its expected position.

## API

The component accepts two props:

- `children` a single React element to reposition when the Safari overflow bar appears.
- `offset` expected offset in `px` from the bottom of the viewport.

## Contributing

Fork the main repo and submit PRs
