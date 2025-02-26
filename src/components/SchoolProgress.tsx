'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/app/supabase-provider';
import { Program, UserProgram, SchoolProgress as SchoolProgressType } from '@/types/school';
import { CircularProgress, Card, CardContent } from '@/components/ui';

export default function SchoolProgress() {
  const { supabase, session } = useSupabase();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
  const [progress, setProgress] = useState<SchoolProgressType>({
    totalCredits: 0,
    completedCredits: 0,
    inProgressCredits: 0,
    remainingCredits: 0,
    completionPercentage: 0,
    courses: []
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (session?.user?.id) {
      loadPrograms();
      loadUserProgram();
    }
  }, [session?.user?.id, loadPrograms, loadUserProgram]);

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

        <div>
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
        </div>
      </CardContent>
    </Card>
  );
}
