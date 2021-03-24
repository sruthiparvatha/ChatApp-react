import './App.css';
import React, { useRef, useState } from 'react';
import firebase from  'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAgWjh7TC3G_V-apLawLKgojIJB2CWJL9c",
  authDomain: "asset-management-iot.firebaseapp.com",
  databaseURL: "https://asset-management-iot.firebaseio.com",
  projectId: "asset-management-iot",
  storageBucket: "asset-management-iot.appspot.com",
  messagingSenderId: "992401748239",
  appId: "1:992401748239:web:d8a488cd701690e0218e7a",
  measurementId: "G-75VW1W2WRE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//Note: set the rules in firestore database to allow read and write: if true;

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth); // returns userid and email if any current user is present, else returns null
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />} 
      </section>

    
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <center><p>Disclaimer: Do not violate the community guidelines.</p></center>
    </>
  )

}



function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' }); // get real time message data stored in firestore using this react-hook

  const [formValue, setFormValue] = useState(''); 

  //Event Handler on submit of form
  const sendMessage = async (e) => {
    e.preventDefault(); //Prevent automatic page refresh on form submission

    const { uid, photoURL } = auth.currentUser;

    // used to add a new message to firestore backend
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    //clear form input after sending data to backend
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  // Note <> </> tags allow you to return more than one JSX tag at a time
  // Bind state to form input
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type Somthing Nice Here." />

      <button type="submit" disabled={!formValue}>💬</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
      <>
        <div className={`message ${messageClass}`}>
          <img src={photoURL} />
          <p>{text}</p>
      </div>
        
      </>
    
    
  )
}




export default App;
