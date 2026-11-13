
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MessagePage.css";

const initialChats = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "👩🏻",
    online: true,
    messages: [
      { id: 1, text: "Hey! How are you?", sender: "them", time: "09:30 AM" },
      { id: 2, text: "I'm doing great! How about you?", sender: "me", time: "09:32 AM" },
      { id: 3, text: "Are we meeting today?", sender: "them", time: "09:35 AM" }
    ]
  },
  {
    id: 2,
    name: "Michael Smith",
    avatar: "👨🏻",
    online: true,
    messages: [
      { id: 1, text: "Please share the project update.", sender: "them", time: "10:15 AM" }
    ]
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "👩🏼",
    online: false,
    messages: [
      { id: 1, text: "Thank you for your help!", sender: "them", time: "Yesterday" }
    ]
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "👨🏽",
    online: true,
    messages: [
      { id: 1, text: "Meeting scheduled for tomorrow.", sender: "them", time: "Yesterday" }
    ]
  },
  {
    id: 5,
    name: "Jessica Brown",
    avatar: "👩🏽",
    online: false,
    messages: [
      { id: 1, text: "Got it. Thanks!", sender: "them", time: "Yesterday" }
    ]
  }
];

const MessagePage = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const selectedChat = chats.find(chat => chat.id === activeChat);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMessage("");
  };

  const openChat = (id) => {
    setActiveChat(id);
    setShowChat(true);
  };

  return (
    <div className="message-page">

      {/* Header */}
      <header className="message-header">
        <button
          className="message-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <div>
          <h2>Messages</h2>
          <p>Stay connected with your team</p>
        </div>

        <div className="message-header-icon">✉️</div>
      </header>

      <main className="message-main">

        {/* Chat List */}
        <section className={`message-sidebar ${showChat ? "hide-mobile" : ""}`}>

          <div className="message-list-heading">
            <h3>Chats</h3>
            <span>{chats.length} Contacts</span>
          </div>

          <div className="message-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="message-contact-list">

            {filteredChats.map(chat => {
              const lastMessage = chat.messages[chat.messages.length - 1];

              return (
                <div
                  key={chat.id}
                  className={`message-contact ${
                    activeChat === chat.id ? "selected" : ""
                  }`}
                  onClick={() => openChat(chat.id)}
                >
                  <div className="contact-avatar">
                    {chat.avatar}
                    {chat.online && <span className="online-dot"></span>}
                  </div>

                  <div className="contact-info">
                    <h4>{chat.name}</h4>
                    <p>{lastMessage?.text || "Start a conversation"}</p>
                  </div>

                  <span className="contact-time">
                    {lastMessage?.time || ""}
                  </span>
                </div>
              );
            })}

            {filteredChats.length === 0 && (
              <p className="no-contacts">No contacts found.</p>
            )}

          </div>
        </section>

        {/* Chat Window */}
        <section className={`message-chat-window ${showChat ? "show-mobile" : ""}`}>

          {selectedChat ? (
            <>
              <div className="chat-top-header">

                <button
                  className="mobile-chat-back"
                  onClick={() => setShowChat(false)}
                >
                  ←
                </button>

                <div className="chat-user-avatar">
                  {selectedChat.avatar}
                  {selectedChat.online && <span className="online-dot"></span>}
                </div>

                <div className="chat-user-info">
                  <h3>{selectedChat.name}</h3>
                  <p>
                    {selectedChat.online ? "● Online" : "Offline"}
                  </p>
                </div>

                <button className="chat-more-btn">⋮</button>

              </div>

              <div className="chat-messages">

                <div className="chat-date-label">Today</div>

                {selectedChat.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`chat-message-row ${
                      msg.sender === "me" ? "my-message" : "their-message"
                    }`}
                  >
                    <div className="chat-bubble">
                      <p>{msg.text}</p>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))}

              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />

                <button type="submit" disabled={!message.trim()}>
                  ➤
                </button>

              </form>
            </>
          ) : (
            <div className="chat-empty">
              <div>💬</div>
              <h3>Your Messages</h3>
              <p>Select a contact to start chatting with your team.</p>
            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default MessagePage;
