import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import sendIcon from '../components/sendIcon'

const ChatPage = ({socket}) => {

    const [messages, setMessages] = useState([]);
    const [isConnectionOpen, setConnectionOpen] = useState(true)
    const [messageBody, setMessageBody] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { username } = useParams();

    const sendMessage = () => {
        if(messageBody) {
          socket.emit('message',
                {
                    sender: username,
                    body: messageBody,
                }
            );
            setMessageBody("");
        }
    };

    useEffect(() => {
        socket.on('messageResponse', (event) => {
            setMessages((_messages) => [..._messages, event]);
        });

    }, [socket]);

    useEffect(() => {
      function onlineHandler() {
        setIsOnline(true);
      }
  
      function offlineHandler() {
        setIsOnline(false);
      }
      window.addEventListener("online", onlineHandler);
      window.addEventListener("offline", offlineHandler);
      return () => {
        window.removeEventListener("online", onlineHandler);
        window.removeEventListener("offline", offlineHandler);
      };
    }, []);
    const scrollTarget = useRef(null);

    useEffect(() => {
        if(scrollTarget.current) {
            scrollTarget.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages.length]);

  return (
    <Layout>
         <h2 className='text-3xl font-bold'>socket.io</h2>
        <div id="chat-view-container" className="flex flex-col w-1/3">
        {messages.map((message, index) => (
          <div key={index} className={`my-3 rounded py-3 w-1/3 text-white ${
            message.sender === username ? "self-end bg-purple-600" : "bg-blue-600"
          }`}>
            <div className="flex items-center">
              <div className="ml-2">
                <div className="flex flex-row">
                  <div className="text-sm font-medium leading-5 text-gray-900">
                    {message.sender} at
                  </div>
                  <div className="ml-1">
                    <div className="text-sm font-bold leading-5 text-gray-900">
                      {/* {new Date(message.sentAt).toLocaleTimeString(undefined, {
                        timeStyle: "short",
                      })}{" "} */}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold leading-5">
                  {message.body}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollTarget} />
      </div>
      <footer className="w-1/3">
        <p>
          You are chatting as <span className="font-bold">{username}</span>
        </p>
        {!isOnline && (
          <p className="text-red-500">Psst.. You are offline.</p>
        )}
        <div className="flex flex-row">
          <input
            id="message"
            type="text"
            className="w-full border-2 border-gray-200 focus:outline-none rounded-md p-2 hover:border-purple-400"
            placeholder="Type your message here..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
          />
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen || !isOnline}
          >
            {sendIcon}
          </button>
        </div>
      </footer>
    </Layout>
  )
}

export default ChatPage
