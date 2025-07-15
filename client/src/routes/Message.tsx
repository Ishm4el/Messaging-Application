import { useParams } from "react-router-dom";
import styles from "./Message.module.css";
import { useFetchGetExternal } from "../components/useFetchGet";
import { useState } from "react";
import fetchPost from "../components/fetchPost";

function MessageList({ loading, error, messages }: MessageList) {
  if (loading) return <p>Loading ...</p>;
  if (messages === null || error) return <p>Error ...</p>;

  console.log(messages);

  return (
    <ul className={styles["list"]}>
      {messages.map((message) => {
        return (
          <li
            key={message.id}
            className={
              styles[
                message.author.username === localStorage.getItem("username")
                  ? "message-primary"
                  : "message-other"
              ]
            }
          >
            {message.text}
          </li>
        );
      })}
    </ul>
  );
}

function MessageInput({ username, setMessages }: MessageInput) {
  return (
    <form
      className={styles["input-container"]}
      onSubmit={(ev) => {
        ev.preventDefault();
        const form = ev.currentTarget;
        const formData = new FormData(form);
        const jsonFormData = Object.fromEntries(formData.entries());
        fetchPost({
          link: `messages/send_direct_message/${username}`,
          body: jsonFormData,
        })
          .then((res) => res.json())
          .then((resJson: Message) =>
            setMessages((prev: Messages | null) => {
              if (prev === null) {
                return [resJson];
              } else {
                return [resJson, ...prev];
              }
            })
          )
          .finally(() => {
            console.log("reseting");
            console.log(form.reset());
          });
      }}
    >
      <textarea
        placeholder={`write a message to ${username}`}
        required
        name="text"
        className={styles["input-text"]}
        tabIndex={1}
        autoFocus
      />
      <button type="submit" className={styles["send-button"]} tabIndex={1}>
        Send
      </button>
    </form>
  );
}

function MessageBody({ username }: { username: string | undefined }) {
  const [messages, setMessages] = useState<Messages | null>(null);
  const { loading, error } = useFetchGetExternal({
    link: `messages/direct_messages/${username}`,
    dependecy: [],
    setFetchedData: setMessages,
  });

  if (!username) return <p>Loading...</p>;
  return (
    <section className={styles["section"]}>
      <h1 className={styles["title"]}>Messaging {username}</h1>
      <MessageList
        username={username}
        error={error}
        loading={loading}
        messages={messages}
      />
      <MessageInput username={username} setMessages={setMessages} />
    </section>
  );
}

export default function Message() {
  const { username } = useParams();
  return (
    <main
      className={
        styles[localStorage.getItem("backgroundColorSettings") || "main"]
      }
    >
      <MessageBody username={username} />
    </main>
  );
}
