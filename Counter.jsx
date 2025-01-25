import React, { useState } from 'react';

export default function Counter() {
  const [state, setState] = useState(0);
  const [apiData, setApiData] = useState(null);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function Inc() {
    setState((prevState) => prevState + 1);

    // API call
    const fetchData = async () => {
      setLoading(true);   
      setError(null);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1'); 
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();    
        setApiData(JSON.stringify(result));      
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  return (
    <div>
      <h1>Counter is {state}</h1>
      <button onClick={Inc}>Click</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {apiData && (
        <div>
          <h2>API Data:</h2>
          <p>{apiData}</p>
          
        </div>
      )}
    </div>
  );
}
