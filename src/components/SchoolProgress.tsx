'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/app/supabase-provider';
import { Program, UserProgram, SchoolProgress as SchoolProgressType, SchoolTask } from '@/types/school';
import { CircularProgress, Card, CardContent } from '@/components/ui';

export default function SchoolProgress() {
  const { supabase, session } = useSupabase();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
  const [tasks, setTasks] = useState<SchoolTask[]>([]);
  const [newTask, setNewTask] = useState<Partial<SchoolTask>>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo'
  });
  const [progress, setProgress] = useState<SchoolProgressType>({
    totalCredits: 0,
    completedCredits: 0,
    inProgressCredits: 0,
    remainingCredits: 0,
    completionPercentage: 0,
    courses: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    const { data: programs, error } = await supabase
      .from('programs')
      .select('*');

    if (error) {
      console.error('Error loading programs:', error);
      return;
    }

    setPrograms(programs);
  }, [supabase]);

  const loadUserProgram = useCallback(async () => {
    if (!session?.user?.id) return;

    const { data: userPrograms, error } = await supabase
      .from('user_programs')
      .select('*, program:programs(*)')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error loading user program:', error);
      return;
    }

    setUserProgram(userPrograms);
  }, [supabase, session?.user?.id]);

  const loadCourses = useCallback(async () => {
    if (!userProgram?.program_id || !session?.user?.id) return;

    const { data: courses, error } = await supabase
      .from('user_courses')
      .select('*, course:courses(*)')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error loading courses:', error);
      return;
    }

    // Calculate progress
    const totalCredits = userProgram.program?.total_credits || 0;
    const completedCredits = courses
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.course?.credits || 0), 0);
    const inProgressCredits = courses
      .filter(c => c.status === 'in_progress')
      .reduce((sum, c) => sum + (c.course?.credits || 0), 0);
    const remainingCredits = totalCredits - completedCredits - inProgressCredits;
    const completionPercentage = (completedCredits / totalCredits) * 100;

    setProgress({
      totalCredits,
      completedCredits,
      inProgressCredits,
      remainingCredits,
      completionPercentage,
      courses
    });

    setLoading(false);
  }, [supabase, userProgram?.program_id, session?.user?.id, userProgram?.program?.total_credits]);

  const loadTasks = useCallback(async () => {
    if (!session?.user?.id) return;

    const { data: tasks, error } = await supabase
      .from('school_tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    setTasks(tasks);
  }, [supabase, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      loadPrograms();
      loadUserProgram();
      loadTasks();
    }
  }, [session?.user?.id, loadPrograms, loadUserProgram, loadTasks]);

  useEffect(() => {
    if (userProgram) {
      loadCourses();
    }
  }, [userProgram, loadCourses]);

  const handleProgramSelect = async (programId: string) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('user_programs')
      .upsert({
        user_id: session.user.id,
        program_id: programId,
        start_date: new Date().toISOString().split('T')[0]
      });

    if (error) {
      console.error('Error setting program:', error);
      return;
    }

    loadUserProgram();
  };

  const handleAddTask = async () => {
    if (!session?.user?.id || !selectedCourse) return;

    const task = {
      ...newTask,
      user_id: session.user.id,
      course_id: selectedCourse
    };

    const { error } = await supabase
      .from('school_tasks')
      .insert(task);

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    setNewTask({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'todo'
    });
    loadTasks();
  };

  const handleUpdateTaskStatus = async (taskId: string, status: 'todo' | 'in_progress' | 'completed') => {
    const { error } = await supabase
      .from('school_tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    loadTasks();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <CircularProgress />
    </div>;
  }

  if (!userProgram) {
    return (
      <Card className="bg-white/5 p-6">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Select Your Program</h2>
          <div className="space-y-4">
            {programs.map(program => (
              <button
                key={program.id}
                onClick={() => handleProgramSelect(program.id)}
                className="w-full p-4 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <h3 className="font-medium">{program.name}</h3>
                <p className="text-sm text-gray-400">{program.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{userProgram.program?.name} Progress</h2>
              <p className="text-gray-400">Started on: {new Date(userProgram.start_date).toLocaleDateString()}</p>
            </div>
            <div className="relative w-24 h-24">
              <CircularProgress
                value={progress.completionPercentage}
                size="xl"
                strokeWidth={8}
                showValue
                label={`${Math.round(progress.completionPercentage)}%`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-gray-400">Completed Credits</p>
              <p className="text-2xl font-semibold">{progress.completedCredits}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-2xl font-semibold">{progress.inProgressCredits}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-gray-400">Remaining</p>
              <p className="text-2xl font-semibold">{progress.remainingCredits}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tasks & Assignments</h3>
          
          {/* Add New Task */}
          <div className="mb-6 p-4 rounded-lg bg-white/5">
            <h4 className="text-md font-medium mb-3">Add New Task</h4>
            <div className="space-y-3">
              <select
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-2 rounded bg-white/10 text-white"
              >
                <option value="">Select Course</option>
                {progress.courses.map(userCourse => (
                  <option key={userCourse.course?.id} value={userCourse.course?.id}>
                    {userCourse.course?.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full p-2 rounded bg-white/10 text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={handleAddTask}
                className="w-full p-2 rounded bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="p-4 rounded-lg bg-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-400">{task.description}</p>
                    <p className="text-sm mt-1">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                    </p>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as 'todo' | 'in_progress' | 'completed')}
                    className="p-1 rounded bg-white/10 text-white text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Existing Courses Section */}
      <Card className="bg-white/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Courses</h3>
          <div className="space-y-3">
            {progress.courses.map(userCourse => (
              <div
                key={userCourse.id}
                className="p-4 rounded-lg bg-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{userCourse.course?.name}</p>
                  <p className="text-sm text-gray-400">{userCourse.course?.code} • {userCourse.course?.credits} credits</p>
                </div>
                <div className="flex items-center space-x-2">
                  {userCourse.grade && (
                    <span className="px-2 py-1 rounded bg-white/10 text-sm">
                      Grade: {userCourse.grade}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-sm ${
                    userCourse.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    userCourse.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {userCourse.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
