import 'jest';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import {configure, shallow, ShallowWrapper} from 'enzyme';
import {FixedBottom, FixedBottomProps, FixedBottomState} from '~/FixedBottom';

configure({adapter: new Adapter()});

const offset = 20;
const childElementProps = {
  children: 'Dummy content',
  className: 'childElement',
  style: {top: 20},
};
const childElement = <div {...childElementProps} />;

describe('<FixedBottom /> tests', () => {
  let wrapper: ShallowWrapper<any, FixedBottomState, FixedBottom>;
  let instance: FixedBottom;

  beforeEach(() => {
    wrapper = shallow(<FixedBottom offset={offset}>{childElement}</FixedBottom>);
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it should render the children with expected props', () => {
    const component = renderer.create(<FixedBottom offset={offset}>{childElement}</FixedBottom>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('handleScroll should throttle computeOffsetBottom', () => {
    jest.mock('lodash.throttle');
    const mockedThrottle = require('lodash.throttle');
    mockedThrottle.mockImplementation(fn => fn);
    wrapper = shallow(<FixedBottom offset={offset}>{childElement}</FixedBottom>);
    instance = wrapper.instance();
    const mockDiv = document.createElement('div');
    mockDiv.getBoundingClientRect = jest.fn().mockReturnValue({bottom: window.innerHeight});
    instance.anchorRef = {
      current: mockDiv,
    };
    instance.handleScroll();
    expect(mockDiv.getBoundingClientRect).toHaveBeenCalledTimes(1);
  });

  describe('componentDidMount', () => {
    let addEventListenerSpy: jest.SpyInstance<void, any>;
    let computeOffsetBottomStub: jest.Mock<any, any>;

    beforeEach(() => {
      jest.useFakeTimers();
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      computeOffsetBottomStub = jest.fn();
      instance.computeOffsetBottom = computeOffsetBottomStub;
    });

    test('should bind a scroll listener, and defer compute offsetBottom if it is safari mobile', () => {
      instance.isSafariMobile = true;
      instance.componentDidMount();
      expect(addEventListenerSpy).toBeCalledWith('scroll', instance.handleScroll);
      expect(computeOffsetBottomStub).not.toBeCalled();
      jest.advanceTimersByTime(1);
      expect(computeOffsetBottomStub).toBeCalled();
    });

    test('should do nothing otherwise', () => {
      instance.isSafariMobile = false;
      instance.componentDidMount();
      expect(addEventListenerSpy).not.toBeCalled();
      expect(computeOffsetBottomStub).not.toBeCalled();
    });
  });

  describe('componentWillUnmount', () => {
    let clearTimeoutSpy: jest.SpyInstance<void, [(number | undefined)?]>;
    let removeEventListenerSpy: jest.SpyInstance<void, [string, EventListenerOrEventListenerObject, (boolean | EventListenerOptions | undefined)?]>;

    beforeEach(() => {
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      jest.spyOn(instance.handleScroll, 'cancel');
      clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    });

    test('should remove the scroll listener and cancel the scroll handler if it is safari mobile', () => {
      instance.isSafariMobile = true;
      instance.componentWillUnmount();
      expect(removeEventListenerSpy).toBeCalledWith('scroll', instance.handleScroll);
      expect(instance.handleScroll.cancel).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    test('should do nothing otherwise', () => {
      instance.isSafariMobile = false;
      instance.componentWillUnmount();
      expect(removeEventListenerSpy).not.toBeCalled();
      expect(instance.handleScroll.cancel).not.toBeCalled();
      expect(clearTimeoutSpy).not.toBeCalled();
    });
  });

  describe('computeOffsetBottom', () => {
    test('should not fail if there is no ref.current', () => {
      const computingWithoutRefCurrent = () => {
        instance.anchorRef = {current: null};
        instance.computeOffsetBottom();
      };
      expect(computingWithoutRefCurrent).not.toThrow();
    });

    test('should add the safari menu height to the offset if it is hiding the element', () => {
      const mockDiv = document.createElement('div');
      mockDiv.getBoundingClientRect = jest.fn().mockReturnValue({bottom: window.innerHeight + 10});
      instance.anchorRef = {
        current: mockDiv
      };
      expect(wrapper.state().bottom).toBe(offset);
      instance.computeOffsetBottom();
      expect(wrapper.state().bottom).toBe(offset + 44);
    });

    test('should use the provided offset otherwise', () => {
      const mockDiv = document.createElement('div');
      mockDiv.getBoundingClientRect = jest.fn().mockReturnValue({bottom: window.innerHeight - offset});
      instance.anchorRef = {
        current: mockDiv,
      };
      expect(wrapper.state().bottom).toBe(offset);
      instance.computeOffsetBottom();
      expect(wrapper.state().bottom).toBe(offset);
    });
  });

  describe('render', () => {
    test('should clone the children and add some extra props', () => {
      const clone = wrapper.find(`.${childElementProps.className}`);
      expect(clone.type()).toBe(childElement.type);
      expect(clone.props().style).toEqual({
        ...childElementProps.style,
        bottom: offset,
        position: 'fixed',
      });
    });

    test('should render an anchor div stuck to bottom when it is safari mobile', () => {
      expect(wrapper.find('div').length).toBe(1);
      instance.isSafariMobile = true;
      wrapper.setProps({reRender: 1});
      expect(wrapper.find('div').length).toBe(2);
      expect(
        wrapper
          .find('div')
          .at(1)
          .props().style
      ).toEqual({
        position: 'fixed',
        bottom: offset,
      });
    });

    test('should have an offset of 0 by default', () => {
      const defaultPropsWrapper: ShallowWrapper<FixedBottomProps, FixedBottomState, FixedBottom> = shallow(
        <FixedBottom>
          <div>hello</div>
        </FixedBottom>
      );
      expect(defaultPropsWrapper.state().bottom).toBe(0);
    });
  });
});
