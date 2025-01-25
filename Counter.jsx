import React, { useState, useEffect } from 'react';

export default function Counter() {
  const [state, setState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prevState) => prevState + 1);
    }, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <h1>Counter: {state}</h1>
    </div>
  );
}
