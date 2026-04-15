import { useState } from 'react';
import MessageBox from '../components/MessageBox';
import { Send } from 'lucide-react';

export default function Messages() {
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([
    { sender: 'Admin', text: 'Hey Alex, how is the dashboard update going?', time: '10:10 AM' },
    { sender: 'Me', text: 'Its 90% done, working on routing now!', time: '10:15 AM' },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if(!msg) return;
    setList([...list, { sender: 'Me', text: msg, time: 'Just now' }]);
    setMsg("");
  }

  return (
    <div className="max-w-2xl bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
         <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
         <div>
            <p className="font-bold text-gray-800">Branch Discussion</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest italic">3 Active Now</p>
         </div>
      </div>
      
      <MessageBox messages={list} />

      <form onSubmit={handleSend} className="flex gap-2">
        <input 
          value={msg} 
          onChange={e => setMsg(e.target.value)}
          placeholder="Type something..." 
          className="flex-1 border-none bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
        <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition">
          <Send size={18}/>
        </button>
      </form>
    </div>
  );
}