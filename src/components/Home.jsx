import React from 'react'

// import Peer from 'simple-peer'
import Echo from 'laravel-echo';
// import axios from 'axios';
import Pusher from 'pusher-js';


function setupLogin() {
  axios.post('http://127.0.0.1:8000/api/login', {
    email: 'johndoe@test.com',
    password: 'secret'
  })
  .then((res) => {
    let token = res.data['authorization']['token'];
    localStorage.setItem('accessToken', token);
    console.log("token set...")
  })
  .catch((err) => {
    console.log(err);
  });


}


function setup() {
  console.log("test");

  window.Pusher = Pusher;

  // console.log(import.meta.env.VITE_PUSHER_APP_CLUSTER);

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    "authHost": "http://localhost:8000/public",
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
        headers: {
            // 'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*'
        }
    }
  })

  initializeStreamingChannel();

}


function initializeStreamingChannel() {
  let streamId = 11234;
  console.log("viewer trying to join stream");
  console.log("stream id viewer  ", streamId);
  let streamingPresenceChannel = window.Echo.join(
      `streaming-channel.${streamId}`
  );

  console.log("After viewer join code")
}


function streamOffer() {
  let auth_user_id = 1;
  axios.post('http://127.0.0.1:8000/api/stream-offer',
   {
    data:{
      broadcaster: 1,
      receiver: {
        id: 1,
        name: 'John'
      },
      offer: "test offer",
    }
  },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      }

    }
  )
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}


function getUser() {
  axios.post('http://localhost:8000/api/details', {
    data: {
      test: "test"
    }
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Access-Control-Allow-Origin': '*',
    }
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
}


function Home() {

  return (
    <div>
      Home

      <br />

      <button onClick={()=> setupLogin()}>Login</button>

      <br />
      <br />

      <button onClick={() => setup()}>Join presence channel</button>
      <br />
      <br />

      <button onClick={() => streamOffer()}>Send Stream Offer</button>
      <br />
      <br />

      <button onClick={() => getUser()}>Get User Details</button>

    </div>
  )
}

export default Home