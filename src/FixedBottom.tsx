import React, {ReactElement, RefObject} from 'react';
import throttle from 'lodash.throttle';
import {isSafariMobile} from './util';
import {Cancelable} from 'lodash';

const SAFARI_MOBILE_BOTTOM_MENU_HEIGHT = 44;

export interface FixedBottomProps {
  children: React.ReactChild;
  offset?: number;
}

export interface FixedBottomState {
  bottom: number;
}

/**
 * Component that allows sticking elements to the bottom of the screen:
 *   - iOS Safari has a long-standing issue when using `position: fixed` near the
 *   bottom edge of the screen.
 *   - `window.innerHeight` reflects the available size and it changes when the
 *   navigation bars are visible.
 *
 * This components implements the following solution:
 *   1. Check for `iosSafariMobile()`
 *   2. Check if the element is hidden by the overflow bar
 *   3. Either add a `44px` offset to place it above the bar or
 *   keep it at its original position
 *   4. On mount, check whether the overflow bar is already
 *   visible
 */
export class FixedBottom extends React.PureComponent<FixedBottomProps> {

  state: FixedBottomState = {
    bottom: this.props.offset || 0,
  };

  isSafariMobile = isSafariMobile();

  anchorRef: RefObject<HTMLDivElement> = React.createRef();

  deferredComputeOffsetBottom: number;

  handleScroll: (() => void) & Cancelable;

  constructor(props: FixedBottomProps) {
    super(props);
    this.handleScroll = throttle(this.computeOffsetBottom, 200);
  }

  componentDidMount() {
    if (this.isSafariMobile) {
      window.addEventListener('scroll', this.handleScroll);
      this.deferredComputeOffsetBottom = setTimeout(this.computeOffsetBottom);
    }
  }

  componentWillUnmount() {
    if (this.isSafariMobile) {
      this.handleScroll.cancel();
      window.removeEventListener('scroll', this.handleScroll);
      window.clearTimeout(this.deferredComputeOffsetBottom);
    }
  }

  computeOffsetBottom = () => {
    if (!this.anchorRef.current) {
      return;
    }

    const {bottom} = this.anchorRef.current.getBoundingClientRect();
    const {offset = 0} = this.props;
    if (Math.floor(Number(bottom)) > window.innerHeight) {
      this.setState({bottom: offset + SAFARI_MOBILE_BOTTOM_MENU_HEIGHT});
    } else {
      this.setState({bottom: offset});
    }
  };

  render() {
    const {bottom} = this.state;
    const {children, offset} = this.props;
    const node = React.cloneElement(children as ReactElement, {
      style: {
        ...(children as ReactElement).props.style,
        bottom,
        position: 'fixed',
      },
    });
    return (
      <>
        {node}
        {this.isSafariMobile && (
          <div
            ref={this.anchorRef}
            style={{
              position: 'fixed',
              bottom: offset,
            }}
          />
        )}
      </>
    );
  }
}
