"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/profile');
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          profileImage: null
        });
        
        // Set preview image with fallback and cache-busting
        const imageUrl = data.profileImage ? `${data.profileImage}?t=${new Date().getTime()}` : '/default-avatar.png';
        setPreviewImage(imageUrl);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user data with the response
        setUser(data);
        
        // Update preview with cache busting
        if (data.profileImage) {
          setPreviewImage(`${data.profileImage}?t=${new Date().getTime()}`);
        }
        
        setIsEditing(false);
        setError('');
        
        // Update profile image in localStorage if used
        if (typeof window !== 'undefined') {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          userData.profileImage = data.profileImage;
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } else {
        setError(data.error || 'Failed to update profile');
        // Log the error for debugging
        console.error('Profile update error:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <Image
                  src={previewImage}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  onError={() => {
                    setImageError(true);
                    setPreviewImage('/default-avatar.png');
                  }}
                  priority
                  unoptimized={true}
                />
              </div>
              {isEditing && (
                <div className="flex flex-col items-center space-y-2">
                  <label
                    htmlFor="profileImage"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    Change Photo
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            {/* Submit/Cancel Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      profileImage: null
                    });
                    setPreviewImage(user.profileImage || '/default-avatar.png');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 