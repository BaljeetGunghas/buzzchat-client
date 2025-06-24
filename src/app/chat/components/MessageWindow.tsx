"use client";

const messages = [
  { id: 1, fromMe: false, text: "Hey! How are you?" },
  { id: 2, fromMe: true, text: "I'm good, thanks! You?" },
  { id: 3, fromMe: false, text: "Doing well! What’s up?" },
  { id: 4, fromMe: true, text: "Just working on the project." },
];

export default function MessageWindow() {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs break-words ${
                msg.fromMe
                  ? "bg-yellow-400 text-black rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
