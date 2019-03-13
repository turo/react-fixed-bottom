# react-stick-to-bottom
> React component to fix a child element to the bottom of the window

## Features
- Sets the CSS properties of the wrapped children to:
```javascript
{
   position: 'fixed';
   bottom: props.offset || 0
}
```
- Safari mobile user agent detection
- Reacts to Safari mobile overflow bar display. If the bar hides a fixed bottom element, 
it is repositioned so it becomes visible in its expected position.
- For non-Safari mobile user agents: no-op.

## API
The component accepts two props:
- `children` a single React element to reposition when the Safari overflow bar appears. 
- `offset` expected offset in `px` from the bottom of the viewport.
