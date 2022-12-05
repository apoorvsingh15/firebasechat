import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

import Login from '../components/auth/Login';
import Chat from '../components/Chat';

const Home = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsUserLoggedIn(true);
        setUserDetails(user);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      {isUserLoggedIn ? <Chat user={userDetails} /> : <Login />}
    </SafeAreaView>
  );
};

export default Home;
