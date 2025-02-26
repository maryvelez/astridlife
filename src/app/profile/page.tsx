'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileData {
  name: string;
  nickname: string;
  age: string;
  location: string;
  bio: string;
  hobbies: string[];
  funFacts: {
    [key: string]: string;
  };
}

export default function Profile() {
  const [activeSection, setActiveSection] = useState('info');
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    nickname: '',
    age: '',
    location: '',
    bio: '',
    hobbies: [''],
    funFacts: {
      funActivities: '',
      futureVision: '',
      favoritePlace: '',
      dreamJob: '',
      perfectDay: ''
    }
  });

  const handleHobbyChange = (index: number, value: string) => {
    const newHobbies = [...profile.hobbies];
    newHobbies[index] = value;
    setProfile({ ...profile, hobbies: newHobbies });
  };

  const addHobby = () => {
    setProfile({ ...profile, hobbies: [...profile.hobbies, ''] });
  };

  const removeHobby = (index: number) => {
    const newHobbies = profile.hobbies.filter((_, i) => i !== index);
    setProfile({ ...profile, hobbies: newHobbies });
  };

  return (
    <div className="min-h-screen bg-white">
      <Link href="/bubbles" className="text-blue-600 hover:text-blue-800 p-8 inline-block text-2xl">
        ←
      </Link>
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex gap-8 items-start">
          {/* Profile Picture Section */}
          <div className="w-64 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-400">Add Photo</span>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              Upload Image
            </button>
          </div>

          {/* Main Profile Section */}
          <div className="flex-1">
            <div className="flex gap-4 mb-8">
              <button 
                className={`px-4 py-2 rounded-full ${activeSection === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                onClick={() => setActiveSection('info')}
              >
                Basic Info
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${activeSection === 'funFacts' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                onClick={() => setActiveSection('funFacts')}
              >
                Fun Facts
              </button>
            </div>

            {activeSection === 'info' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                      value={profile.nickname}
                      onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                      placeholder="What should we call you?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Where are you from?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                  {profile.hobbies.map((hobby, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                        value={hobby}
                        onChange={(e) => handleHobbyChange(index, e.target.value)}
                        placeholder="Enter a hobby"
                      />
                      <button
                        onClick={() => removeHobby(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHobby}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Add Hobby
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What activities make you happiest?</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={2}
                    value={profile.funFacts.funActivities}
                    onChange={(e) => setProfile({
                      ...profile,
                      funFacts: { ...profile.funFacts, funActivities: e.target.value }
                    })}
                    placeholder="Share your favorite activities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Where do you see yourself in 5 years?</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={2}
                    value={profile.funFacts.futureVision}
                    onChange={(e) => setProfile({
                      ...profile,
                      funFacts: { ...profile.funFacts, futureVision: e.target.value }
                    })}
                    placeholder="Share your vision..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's your favorite place in the world?</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={2}
                    value={profile.funFacts.favoritePlace}
                    onChange={(e) => setProfile({
                      ...profile,
                      funFacts: { ...profile.funFacts, favoritePlace: e.target.value }
                    })}
                    placeholder="Tell us about your special place..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's your dream job?</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={2}
                    value={profile.funFacts.dreamJob}
                    onChange={(e) => setProfile({
                      ...profile,
                      funFacts: { ...profile.funFacts, dreamJob: e.target.value }
                    })}
                    placeholder="Describe your ideal career..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe your perfect day</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    rows={2}
                    value={profile.funFacts.perfectDay}
                    onChange={(e) => setProfile({
                      ...profile,
                      funFacts: { ...profile.funFacts, perfectDay: e.target.value }
                    })}
                    placeholder="What would make your day perfect?"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
