import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { mockUserData } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AUTH_STORAGE_KEY = 'math_smart_demo_user_v1';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (value) => typeof value === 'string' && UUID_REGEX.test(value);

export const ROLE_PERMISSIONS = {
  admin: {
    name: 'مدير النظام (مستخدم النظام)',
    category: 'إدارة النظام',
    home: '07',
    allowedScreens: ['hub', '07', '08', '02', '12', '16', '17', '18', '11', '06', '01', '09', '03', '13', '10', '14', '04', '05', '15'],
    deniedMessage: 'لكامل الصلاحيات كمدير نظام، يمكنك إدارة السجلات المركزية ومتابعة أداء المنظومة.'
  },
  supervisor: {
    name: 'مشرف تربوي (مستخدم النظام)',
    category: 'إدارة النظام',
    home: '02',
    allowedScreens: ['hub', '02', '07', '08', '16', '17', '09', '01', '03', '12', '06', '11', '18', '10', '14', '05'],
    deniedMessage: 'هذه الصفحة مخصصة لحسابات الطلاب الشخصية. بصفتك مشرفاً تربوياً، تتوفر لك لوحة القيادة وإدارة السجلات المركزية والتقارير الأكاديمية.'
  },
  teacher: {
    name: 'معلم رياضيات',
    category: 'الكادر التعليمي',
    home: '02',
    allowedScreens: ['hub', '02', '07', '08', '16', '17', '09', '01', '03', '12', '06', '11', '18', '10', '14', '05'],
    deniedMessage: 'هذه الصفحة مخصصة لحسابات الطلاب الشخصية. بصفتك معلماً، تتوفر لك لوحة تحكم المعلم الشاملة لإدارة الفصول ومتابعة الطلاب.'
  },
  student: {
    name: 'طالب (المستخدم العادي)',
    category: 'المستخدم العادي',
    home: '13',
    allowedScreens: ['hub', '13', '09', '03', '17', '01', '12', '06', '11', '18', '04', '05', '15'],
    deniedMessage: 'منطقة إدارية محمية! هذه الصفحة مخصصة حصرياً لـ مدير النظام (مستخدم النظام) والكادر التعليمي لإدارة السجلات والتقارير. بصفتك مستخدماً عادياً (طالباً)، يمكنك الوصول لمساحات التعلّم والمسائل والتحديات.'
  },
  parent: {
    name: 'ولي أمر',
    category: 'الأسرة والمتابعة',
    home: '16',
    allowedScreens: ['hub', '16', '01', '17', '06', '11', '18', '05'],
    deniedMessage: 'هذه الصفحة مخصصة للطلاب أو إدارة النظام فقط. بصفتك ولي أمر، يمكنك متابعة أداء وتقارير ابنك والتواصل مع المعلم عبر بوابة ولي الأمر.'
  },
  guest: {
    name: 'زائر المنصة',
    category: 'زائر',
    home: 'hub',
    allowedScreens: ['hub', '04', '05', '10', '14', '15', '18', '17', '06'],
    deniedMessage: 'يتطلب الوصول إلى هذه الصفحة تسجيل الدخول كطالب أو كمدير نظام أو كمعلم أو ولي أمر.'
  }
};

export const canAccessScreen = (screenId, userRole = 'guest') => {
  const config = ROLE_PERMISSIONS[userRole];
  if (!config) return screenId === 'hub';
  return config.allowedScreens.includes(screenId);
};

export const getDefaultDashboard = (userRole = 'student') => {
  return ROLE_PERMISSIONS[userRole]?.home || 'hub';
};

export const getRoleNameArabic = (userRole = 'student') => {
  return ROLE_PERMISSIONS[userRole]?.name || userRole;
};

/**
 * @typedef {Record<string, any>} AuthUser
 * @typedef {{
 *   role: string,
 *   user: AuthUser,
 *   loading: boolean,
 *   error: string | null,
 *   isLiveBackend: boolean,
 *   loginAs: (newRole: string) => void,
 *   logout: () => Promise<void>,
 *   updateProfile: (fields: Record<string, any>) => Promise<void>,
 *   loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean, user?: any, mode?: string, error?: string }>,
 *   registerWithSupabase: (payload: Record<string, any>) => Promise<{ success: boolean, user?: any, mode?: string, error?: string, requiresEmailConfirmation?: boolean }>,
 *   resetPassword: (email: string) => Promise<{ success: boolean, mode?: string, error?: string }>,
 *   updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean, mode?: string, error?: string }>
 * }} AuthContextValue
 */

/** @type {React.Context<AuthContextValue>} */
const AuthContext = createContext({
  role: 'student',
  user: mockUserData.student,
  loading: false,
  error: null,
  isLiveBackend: isSupabaseConfigured,
  loginAs: () => {},
  logout: async () => {},
  updateProfile: async () => {},
  loginWithSupabase: async () => ({ success: false }),
  registerWithSupabase: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  updatePassword: async () => ({ success: false })
});

const getInitialAuth = () => {
  try {
    if (typeof window !== 'undefined' && !isSupabaseConfigured) {
      const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.user && parsed.role) {
          return parsed;
        }
      }
    }
  } catch {
    // Fallback to default student
  }
  return { role: 'student', user: mockUserData.student };
};

export const AuthProvider = ({ children }) => {
  const initialAuth = useMemo(() => getInitialAuth(), []);
  const [role, setRole] = useState(initialAuth.role);
  const [user, setUser] = useState(initialAuth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isLiveBackend = isSupabaseConfigured;

  // Persist demo session in localStorage so progress survives page reload
  useEffect(() => {
    if (!isLiveBackend) {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role, user }));
      } catch {
        // Ignore storage errors
      }
    }
  }, [role, user, isLiveBackend]);

  // Fetch full profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId, userEmail) => {
    if (!supabase || !isValidUuid(userId)) return;
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
          xp: data.xp ?? 100,
          level: data.level ?? 1,
          streak: data.streak ?? 1,
          accuracy: data.accuracy ?? 95,
          avatar: data.avatar_url || '/assets/avatar_fahad_hero.svg',
          badges: mockUserData.student.badges
        });
      }
    } catch (err) {
      console.error('Error fetching profile from Supabase:', err);
    }
  }, []);

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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
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
  }, [fetchProfile]);

  const loginAs = useCallback((newRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setUser(mockUserData.student);
    } else if (newRole === 'admin') {
      setUser(mockUserData.admin);
    } else if (newRole === 'teacher') {
      setUser(mockUserData.teacher);
    } else if (newRole === 'parent') {
      setUser(mockUserData.parent);
    } else if (newRole === 'supervisor') {
      setUser({
        ...mockUserData.teacher,
        role: 'supervisor',
        title: 'مشرف تربوي رياضيات'
      });
    } else {
      setUser({
        name: 'زائر المنصة',
        role: 'guest',
        avatar: '/assets/avatar_robot.svg'
      });
    }
  }, []);

  const updateProfile = useCallback(async (fields) => {
    setUser(prev => {
      const next = { ...prev, ...fields };
      if (typeof fields.xp === 'number' && fields.level === undefined) {
        next.level = Math.max(1, Math.floor(fields.xp / 500) + 1);
      }
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        let targetId = isValidUuid(fields?.id) ? fields.id : (isValidUuid(user?.id) ? user.id : null);
        if (!targetId) {
          const { data: authData } = await supabase.auth.getUser();
          targetId = isValidUuid(authData?.user?.id) ? authData.user.id : null;
        }
        if (!targetId) return;

        const payload = { updated_at: new Date().toISOString() };
        if (fields.name !== undefined) payload.full_name = fields.name;
        if (fields.grade !== undefined) payload.grade = fields.grade;
        if (fields.school !== undefined) payload.school = fields.school;
        if (fields.avatar !== undefined) payload.avatar_url = fields.avatar;
        if (fields.xp !== undefined) payload.xp = fields.xp;
        if (fields.streak !== undefined) payload.streak = fields.streak;

        await supabase
          .from('profiles')
          .update(payload)
          .eq('id', targetId);
      } catch (err) {
        console.warn('Could not sync profile to Supabase:', err);
      }
    }
  }, [user?.id]);

  // Real Email/Password Registration
  const registerWithSupabase = useCallback(async ({ email, password, fullName, role: userRole = 'student', grade, school, avatarUrl, parentPhone }) => {
    if (!isSupabaseConfigured || !supabase) {
      loginAs(userRole);
      await updateProfile({ name: fullName, grade, school, avatar: avatarUrl, email, parentPhone });
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
            role: userRole,
            grade,
            school,
            avatar_url: avatarUrl,
            parent_phone: parentPhone
          }
        }
      });

      if (authError) throw authError;

      if (data.user && data.session) {
        await fetchProfile(data.user.id, data.user.email);
      }

      return {
        success: true,
        user: data.user,
        requiresEmailConfirmation: !data.session
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loginAs, updateProfile, fetchProfile]);

  // Real Email/Password Login
  const loginWithSupabase = useCallback(async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      if (email.includes('admin')) {
        loginAs('admin');
      } else if (email.includes('teacher') || email.includes('omari')) {
        loginAs('teacher');
      } else if (email.includes('parent') || email.includes('salem')) {
        loginAs('parent');
      } else {
        loginAs('student');
      }
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
      if (data.user) {
        await fetchProfile(data.user.id, data.user.email);
      }
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loginAs, fetchProfile]);

  // Password Reset
  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, mode: 'demo' };
    }
    try {
      setLoading(true);
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#05` : undefined
      });
      if (resetErr) throw resetErr;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (_currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' };
    }

    if (!isSupabaseConfigured || !supabase) {
      setUser(prev => ({
        ...prev,
        passwordUpdatedAt: new Date().toISOString()
      }));
      return { success: true, mode: 'demo' };
    }

    try {
      setLoading(true);
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateErr) throw updateErr;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      }
    }
    setRole('guest');
    setUser({
      name: 'زائر المنصة',
      role: 'guest',
      avatar: '/assets/avatar_robot.svg'
    });
  }, []);

  const value = useMemo(() => ({
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
    resetPassword,
    updatePassword,
    canAccessScreen,
    getDefaultDashboard,
    getRoleNameArabic,
    ROLE_PERMISSIONS
  }), [
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
    resetPassword,
    updatePassword
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/** @returns {AuthContextValue} */
export const useAuth = () => useContext(AuthContext);
