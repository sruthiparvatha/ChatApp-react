import './App.css';
import React from 'react';
import firebase from  'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyC6m2--U6wf5tFyecbZGYBNRz4wec-B-Qw",
  authDomain: "exampleprojects-9c6a5.firebaseapp.com",
  databaseURL: "https://exampleprojects-9c6a5.firebaseio.com",
  projectId: "exampleprojects-9c6a5",
  storageBucket: "exampleprojects-9c6a5.appspot.com",
  messagingSenderId: "863305756672",
  appId: "1:863305756672:web:5783c74b51ecfa2b9728e5",
  measurementId: "G-GT98YM0D9V"
})


const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user]= useAuthState(auth);
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [m] = useCollectionData(query, {idField: 'id'});

  return (
    // Note React renders JSX(JavaScript XML) not HTML elements. JSX is preprocessed to convert to HTML code.
    <div className="App">
      <header>
        <h1>😎</h1>
        {m.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <SignOut />
      </header>
      <section>
        {user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}


function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut(){

  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom(){

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  // Listen to the data by using a react hook, anytime the data changes in backend(firebase) react will re-render this data
  const [messages] = useCollectionData(query, {idField: 'id'}); // returns an array of objects aka the chat messages ordered by latest to oldest

  return(
    //loop over each document or row in the collection
    // render each message separately

    // checks if any messages are present and maps ChatMessage component(contains props key and message) to every element present in the messages array
    <div>
      { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />) }

      <form>
        <input />
      </form>
    </div>

    
  )
}

function ChatMessage(props){

  const { text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{ text }</p>
    </div>
    
  )
}



export default App;
