import React from 'react';
import renderer from 'react-test-renderer';
import FixedBottom from '../src/index';


const offset = 20;
const children = <div className="childComponent">I'm a lonely child</div>;

let component;
beforeEach(() => {
  component = renderer.create(
    <FixedBottom offset={offset}>
      {children}
    </FixedBottom>)
});

test('FixedBottom should render children with expected props', () => {
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

