import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';

const Profile = props => {
  const { username: userParam } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [thoughts, setThoughts] = useState([{
    username: userParam,
    createdAt: '', 
    thought: '',
    image: ''
  }]);

  // retrieve thoughts from the user on component mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/users/${userParam}`);
      
      const data = await res.json();

      setThoughts(data);
      setIsLoaded(true);
      console.log("thoughts: ", thoughts);
      console.log("data: ", data);  
    };
    fetchData();
  }, [userParam]); // warning if dependency not tracked by useEffect

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${userParam}'s` : 'your'} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-9">
        {!isLoaded ? (
            <div>Loading...</div>
          ) : (
          <ThoughtList thoughts={thoughts} title={`${userParam}'s thoughts...`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
