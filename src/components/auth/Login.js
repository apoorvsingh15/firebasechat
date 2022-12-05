import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Switch,
  Alert,
} from 'react-native';
import {validateEmail, validatePassword} from './utils/validation';

const Login = () => {
  const [email, onchangeEmail] = useState('');
  const [password, onchangePassword] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const authenticateUser = () => {
    if (!validateEmail(email)) {
      Alert.alert('Not a valid email');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Password must be atleast 6 characters');
      return;
    }
    // Sign up and login user
    if (isEnabled) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          Alert.alert('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Alredy in use');
          }
          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          }
          console.error(error);
          return;
        });
    }
    // Login user
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed in!');
      })
      .catch(err => Alert.alert('Something went wrong', err.message));
  };

  return (
    <View>
      {isEnabled ? (
        <Text style={styles.headerText}>Register Screen</Text>
      ) : (
        <Text style={styles.headerText}>Login Screen</Text>
      )}
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        returnKeyType="next"
        onChangeText={onchangeEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry={true}
        onChangeText={onchangePassword}
        value={password}
      />
      <View style={styles.buttonStyle}>
        <Button
          onPress={authenticateUser}
          title={isEnabled ? 'Sign up' : 'Sign in'}
          color="#841584"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonStyle: {
    margin: 10,
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default Login;
