import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMessages = () => {
    firestore()
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const msg = [];
        if (querySnapshot !== null) {
          querySnapshot.forEach(documentSnapshot => {
            msg.push(documentSnapshot.data());
            setMessages(msg);
          });
          setLoading(false);
        } else {
          console.log('Something went wrong');
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    const unsubscribe = fetchMessages();
    return () => unsubscribe;
  }, []);

  return {messages, loading};
};
