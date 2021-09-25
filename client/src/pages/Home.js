import React, { useState, useEffect } from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/users');
      const data = await res.json();

      setThoughts([...data]);
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
  }, [thoughts]);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          <ThoughtForm />
        </div>
        <div className={`col-12 mb-3 `}>
          {!isLoaded ? (
            <div>Loading...</div>
          ) : (
              <ThoughtList thoughts={thoughts} setThoughts={setThoughts} title="Some Feed for Thought(s)..." />
            )}
        </div>
      </div>
    </main>
  );
};

export default Home;
