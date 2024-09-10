export default function ChatMessages({ messages }) {
    return (
        <div className="space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`p-3 rounded-lg ${message.sender === 'user'
                            ? 'bg-primary text-white ml-auto'
                            : 'bg-secondary text-main'
                        } max-w-[70%]`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    );
}