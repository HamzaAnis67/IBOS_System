import { useState } from 'react';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Main Hero Design', desc: 'Fix padding and update colors on landing page.', status: 'Pending' },
    { id: 2, title: 'Bug Fixing #401', desc: 'Solve logout redirection loops on mobile chrome.', status: 'In Progress' },
    { id: 3, title: 'Client Interview', desc: 'Present latest prototype to Alpha Clients.', status: 'Completed' },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Tasks</h1>
        <p className="text-gray-500 mt-1 font-medium">Real-time status of your project milestones.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map(t => <TaskCard key={t.id} task={t} onToggle={toggleTask} />)}
      </div>
    </div>
  );
}