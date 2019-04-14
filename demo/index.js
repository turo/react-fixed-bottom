import React from 'react';
import ReactDOM from 'react-dom';
import FixedBottom from '../dist/index';

const App = () => (
  <div
    style={{
      background: 'linear-gradient(#4c4c4c 0%, #000 100%)',
      height: 5000,
    }}
  >
    <FixedBottom offset={20}>
      <div
        style={{
          background: '#000',
          color: '#fff',
          height: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        I'm a fixed Bar with a 20px offset from the edge of the screen which is actually usable in
        Safari mobile.
      </div>
    </FixedBottom>
  </div>
);

ReactDOM.render(<App />, document.querySelector('#container'));
