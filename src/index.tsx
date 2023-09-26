import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <div>Hello, React!</div>;

ReactDOM.render(<App />, document.getElementById('root'));

export default function sum(a: number, b: number) {
  return a + b;
}
