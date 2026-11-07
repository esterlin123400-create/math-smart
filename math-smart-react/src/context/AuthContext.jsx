import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserData } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('student');
  const [user, setUser] = useState(mockUserData.student);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(isSupabaseConfigured);

  // Initialize and listen to Supabase auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        }
      } catch (err) {
        console.warn('Supabase session fetch notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        // Logged out
        setRole('guest');
        setUser({
          name: 'زائر المنصة',
          role: 'guest',
          avatar: '/assets/avatar_robot.svg'
        });
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch full profile from Supabase profiles table
  const fetchProfile = async (userId, userEmail) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (data) {
        setRole(data.role || 'student');
        setUser({
          id: data.id,
          email: data.email || userEmail,
          name: data.full_name || 'بطل الرياضيات',
          role: data.role || 'student',
          grade: data.grade || 'الصف السادس الابتدائي',
          school: data.school || 'مدرسة رواد المعرفة',
          xp: data.xp || 100,
          level: data.level || 1,
          streak: data.streak || 1,
          accuracy: data.accuracy || 95,
          avatar: data.avatar_url || '/assets/avatar_fahad_hero.svg',
          badges: mockUserData.student.badges
        });
      }
    } catch (err) {
      console.error('Error fetching profile from Supabase:', err);
    }
  };

  // Real Email/Password Registration
  const registerWithSupabase = async ({ email, password, fullName, role = 'student', grade, school, avatarUrl }) => {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback demo mode
      loginAs(role);
      updateProfile({ name: fullName, grade, school, avatar: avatarUrl });
      return { success: true, mode: 'demo' };
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            grade,
            school,
            avatar_url: avatarUrl
          }
        }
      });

      if (authError) throw authError;

      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Real Email/Password Login
  const loginWithSupabase = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback demo mode
      loginAs(email.includes('teacher') ? 'teacher' : 'student');
      return { success: true, mode: 'demo' };
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, mode: 'demo' };
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Quick switch for demo & offline inspection
  const loginAs = (newRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setUser(mockUserData.student);
    } else if (newRole === 'teacher' || newRole === 'supervisor') {
      setUser(mockUserData.teacher);
    } else {
      setUser({
        name: 'زائر المنصة',
        role: 'guest',
        avatar: '/assets/avatar_robot.svg'
      });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      }
    }
    setRole('guest');
    setUser({
      name: 'زائر',
      role: 'guest',
      avatar: '/assets/avatar_robot.svg'
    });
  };

  const updateProfile = async (fields) => {
    setUser(prev => ({ ...prev, ...fields }));

    if (isSupabaseConfigured && supabase && user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: fields.name,
            grade: fields.grade,
            school: fields.school,
            avatar_url: fields.avatar,
            xp: fields.xp,
            streak: fields.streak,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync profile to Supabase:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        loading,
        error,
        isLiveBackend,
        loginAs,
        logout,
        updateProfile,
        loginWithSupabase,
        registerWithSupabase,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
