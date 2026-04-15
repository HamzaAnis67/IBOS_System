export default function MessageBox({ messages }) {
  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50 rounded-2xl border mb-4 h-[400px]">
      {messages.map((m, i) => (
        <div key={i} className={`flex flex-col ${m.sender === 'Me' ? 'items-end' : 'items-start'}`}>
          <div className={`p-3 rounded-2xl max-w-xs text-sm ${
            m.sender === 'Me' 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
          }`}>
            <p className="text-[10px] opacity-70 mb-1 font-bold">{m.sender}</p>
            <p>{m.text}</p>
          </div>
          <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{m.time}</span>
        </div>
      ))}
    </div>
  );
}