export default function ChatMessages({ messages }) {
    return (
        <div className="space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`p-3 rounded-lg ${message.sender === 'user'
                            ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                            : 'bg-gray-100 dark:bg-gray-800'
                        } max-w-[70%]`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    );
}