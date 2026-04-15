import { CheckCircle2, Clock } from 'lucide-react';

export default function TaskCard({ task, onToggle }) {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`p-5 rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isCompleted ? 'border-green-100' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
          isCompleted ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {task.status}
        </span>
        {isCompleted ? <CheckCircle2 className="text-green-500" /> : <Clock className="text-gray-300" />}
      </div>
      <h3 className={`font-bold text-gray-800 mb-1 ${isCompleted && 'line-through text-gray-400'}`}>
        {task.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{task.desc}</p>
      {task.status !== 'Completed' && (
        <button 
          onClick={() => onToggle(task.id)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition"
        >
          MARK AS DONE
        </button>
      )}
    </div>
  );
}