import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';

export default function DegreeProgress({ session, profile }) {
  const supabase = createClientComponentClient();
  const [degreeProgram, setDegreeProgram] = useState(profile?.degree_program || '');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    task_type: 'assignment',
    progress: 0
  });

  // Load tasks
  const loadTasks = useCallback(async () => {
    const { data } = await supabase
      .from('school_tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true });
    
    if (data) setTasks(data);
  }, [session?.user?.id, supabase]);

  useEffect(() => {
    if (session?.user) {
      loadTasks();
    }
  }, [session, loadTasks]);

  // Save degree program
  const saveDegreeProgram = async () => {
    await supabase
      .from('profiles')
      .update({ degree_program: degreeProgram })
      .eq('id', session.user.id);
  };

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    const { data } = await supabase
      .from('school_tasks')
      .insert([{
        ...newTask,
        user_id: session.user.id
      }])
      .select();

    if (data) {
      setTasks([...tasks, data[0]]);
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        task_type: 'assignment',
        progress: 0
      });
    }
  };

  // Update task progress
  const updateTaskProgress = async (taskId, progress) => {
    await supabase
      .from('school_tasks')
      .update({ progress })
      .eq('id', taskId);

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    ));
  };

  return (
    <div className="space-y-8">
      {/* Degree Program Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">My Academic Progress</h1>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Enter your degree program"
            value={degreeProgram}
            onChange={(e) => setDegreeProgram(e.target.value)}
          />
          <Button onClick={saveDegreeProgram}>Save Program</Button>
        </div>
      </div>

      {/* Add New Task */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={addTask} className="space-y-4">
          <Input
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
          <Textarea
            placeholder="Break down the steps to complete this task..."
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
          <div className="flex gap-4">
            <Input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              required
            />
            <Select
              value={newTask.task_type}
              onChange={(e) => setNewTask({...newTask, task_type: e.target.value})}
            >
              <option value="assignment">Assignment</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="project">Project</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <Button type="submit">Add Task</Button>
        </form>
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{task.title}</h3>
                <span className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 mt-2">{task.description}</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <span>{task.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
