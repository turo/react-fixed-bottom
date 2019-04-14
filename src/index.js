import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import {isSafariMobile} from './util';

const SAFARI_MOBILE_BOTTOM_MENU_HEIGHT = 44;

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
export default class FixedBottom extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    offset: PropTypes.number,
  };

  static defaultProps = {
    offset: 0,
  };

  state = {
    bottom: this.props.offset,
  };

  isSafariMobile = isSafariMobile();

  anchorRef = React.createRef();

  constructor(props) {
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
    const {offset} = this.props;
    if (Math.floor(bottom) > window.innerHeight) {
      this.setState({bottom: offset + SAFARI_MOBILE_BOTTOM_MENU_HEIGHT});
    } else {
      this.setState({bottom: offset});
    }
  };

  render() {
    const {bottom} = this.state;
    const {children, offset} = this.props;
    const node = React.cloneElement(React.Children.only(children), {
      style: {
        ...children.props.style,
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
