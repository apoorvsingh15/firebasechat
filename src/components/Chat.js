import React, {useRef, useState} from 'react';
import {
  View,
  Button,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {useMessages} from '../hooks/useMessages';

const Chat = ({user}) => {
  const [userMessage, setUserMessage] = useState('');

  // custom hook for monitoring messages from firebase.
  const {messages, loading} = useMessages();

  // ref to scroll user to bottom when a message is sent.
  const flatListRef = useRef(null);

  const onSendMessage = () => {
    if (userMessage === '') {
      Alert.alert('Empty Message');
      return;
    }

    firestore()
      .collection('messages')
      .add({
        userEmail: user._user.email,
        userId: Math.random() * 100000000,
        message: userMessage,
        createdAt: Date.now(),
      })
      .then(() => {
        setUserMessage('');
        // flatListRef.current.scrollToEnd({animated: true});
      });
  };

  const logout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const renderItem = ({item}) => {
    const isMessageSentByUser = user._user.email === item.userEmail;
    return (
      <View
        style={isMessageSentByUser ? styles.userChatStyle : styles.chatStyle}>
        <Text style={styles.userName}>
          {isMessageSentByUser ? 'You said' : `${item.userEmail} says`}
        </Text>
        <Text>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixToText}>
        <Text style={styles.textStyle}>Super Chat</Text>
        <Button onPress={logout} title="Sign out" color="#841584" />
      </View>
      {loading && !messages.length ? (
        <Text>loading...</Text>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.userId}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        />
      )}

      <TextInput
        placeholder="Type here..."
        style={styles.input}
        onChangeText={setUserMessage}
        value={userMessage}
      />
      <View style={styles.buttonMargin}>
        <Button onPress={onSendMessage} title="Send" color="#841584" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#ECE5DD', height: '100%'},
  chatStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    margin: 10,
    marginLeft: 0,
  },
  userChatStyle: {
    backgroundColor: '#DCF8C6',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    margin: 10,
    marginRight: 0,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#075E54',
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 22,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  buttonMargin: {
    margin: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Chat;
