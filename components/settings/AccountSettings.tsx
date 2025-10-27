import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../supabase/client';
import { ProfileEditModal } from '../ProfileEditModal';
import { ConfirmationModal } from '../ConfirmationModal';
import { Page } from '../../App';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const SettingsRow: React.FC<{ label: string; value?: string; children: React.ReactNode }> = ({ label, value, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            {value && <p className="text-base text-slate-800 dark:text-slate-200 mt-1 truncate">{value}</p>}
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">{children}</div>
    </div>
);

interface AccountSettingsProps {
  navigateTo: (page: Page) => void;
}

interface UserProfile {
  full_name: string | null;
  username: string;
  avatar_url: string | null;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ navigateTo }) => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [editModal, setEditModal] = useState<{
      show: boolean;
      field: 'full_name' | 'username' | 'avatar_url';
      label: string;
      value: string;
    } | null>(null);

    const [confirmationModal, setConfirmationModal] = useState<{
      show: boolean;
      type: 'signOutAll' | 'deleteAccount';
    } | null>(null);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching profile:', error);
                const username = user.email?.split('@')[0] || 'user';
                const { data: newProfile, error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        username: username,
                        full_name: username,
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    setProfile({
                        full_name: username,
                        username: username,
                        avatar_url: null
                    });
                } else {
                    setProfile(newProfile);
                }
            } else if (data) {
                setProfile(data);
            } else {
                const username = user.email?.split('@')[0] || 'user';
                const { data: newProfile, error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        username: username,
                        full_name: username,
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    setProfile({
                        full_name: username,
                        username: username,
                        avatar_url: null
                    });
                } else {
                    setProfile(newProfile);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            const username = user.email?.split('@')[0] || 'user';
            setProfile({
                full_name: username,
                username: username,
                avatar_url: null
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEditModal = (field: 'full_name' | 'username' | 'avatar_url', label: string) => {
        if (!profile) return;

        const value = field === 'full_name'
            ? (profile.full_name || '')
            : field === 'username'
            ? profile.username
            : (profile.avatar_url || '');

        setEditModal({
            show: true,
            field,
            label,
            value,
        });
    };

    const handleSignOutAllSessions = async () => {
        try {
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) throw error;

            addToast('Signed out of all sessions', 'success');
            setConfirmationModal(null);
        } catch (error) {
            console.error('Error signing out:', error);
            addToast('Failed to sign out of all sessions', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        try {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .delete()
                .eq('id', user.id);

            if (profileError) throw profileError;

            const { error: conversationsError } = await supabase
                .from('conversations')
                .delete()
                .eq('user_id', user.id);

            if (conversationsError) console.error('Error deleting conversations:', conversationsError);

            await logout();
            addToast('Account deleted successfully', 'success');
            setConfirmationModal(null);
        } catch (error) {
            console.error('Error deleting account:', error);
            addToast('Failed to delete account', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-8 md:p-12">
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500 dark:text-slate-400">Loading...</div>
                </div>
            </div>
        );
    }

    const fullName = profile?.full_name || user?.email.split('@')[0] || 'User';
    const username = profile?.username || user?.email.split('@')[0] || 'user';

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-12">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">Account</h1>

                <div className="space-y-12">
                    <SettingsSection title="Account">
                        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-medium flex-shrink-0">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{fullName}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">@{username}</p>
                            </div>
                            <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                                <Button
                                    variant="secondary"
                                    className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                    onClick={() => handleOpenEditModal('avatar_url', 'Avatar URL')}
                                >
                                    Change avatar
                                </Button>
                            </div>
                        </div>
                        <SettingsRow label="Full Name" value={fullName}>
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                onClick={() => handleOpenEditModal('full_name', 'Full Name')}
                            >
                                Change full name
                            </Button>
                        </SettingsRow>
                        <SettingsRow label="Username" value={`@${username}`}>
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                onClick={() => handleOpenEditModal('username', 'Username')}
                            >
                                Change username
                            </Button>
                        </SettingsRow>
                        <SettingsRow label="Email" value={user?.email}>
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 w-full sm:w-auto opacity-50 cursor-not-allowed"
                                disabled
                                title="Email changes are not currently supported"
                            >
                                Change email
                            </Button>
                        </SettingsRow>
                    </SettingsSection>

                    <SettingsSection title="Your Subscription">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50 gap-4">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Thanks for using Prism AI!</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Explore all features. <button onClick={() => navigateTo('pricing')} className="text-teal-500 hover:underline font-medium">View plans</button>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                                <Button onClick={() => navigateTo('pricing')} variant="secondary" className="dark:bg-slate-700 dark:hover:bg-slate-600 flex-1 sm:flex-none">
                                    Manage plan
                                </Button>
                                <Button onClick={() => navigateTo('pricing')} variant="teal" className="flex-1 sm:flex-none">
                                    Upgrade plan
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="System">
                        <SettingsRow label="Support">
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                onClick={() => navigateTo('contact')}
                            >
                                Contact
                            </Button>
                        </SettingsRow>
                        <SettingsRow label="You are signed in as" value={user?.email}>
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                onClick={logout}
                            >
                                Sign out
                            </Button>
                        </SettingsRow>
                        <SettingsRow label="Sign out of all sessions">
                            <Button
                                variant="secondary"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 w-full sm:w-auto"
                                onClick={() => setConfirmationModal({ show: true, type: 'signOutAll' })}
                            >
                                Sign out of all sessions
                            </Button>
                        </SettingsRow>
                        <SettingsRow label="Delete account">
                            <Button
                                variant="secondary"
                                className="border-red-500/50 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 w-full sm:w-auto"
                                onClick={() => setConfirmationModal({ show: true, type: 'deleteAccount' })}
                            >
                                Permanently delete
                            </Button>
                        </SettingsRow>
                    </SettingsSection>
                </div>
            </div>

            {editModal?.show && user && (
                <ProfileEditModal
                    onClose={() => setEditModal(null)}
                    userId={user.id}
                    currentValue={editModal.value}
                    fieldName={editModal.field}
                    fieldLabel={editModal.label}
                    onSuccess={loadProfile}
                />
            )}

            {confirmationModal?.show && confirmationModal.type === 'signOutAll' && (
                <ConfirmationModal
                    onClose={() => setConfirmationModal(null)}
                    onConfirm={handleSignOutAllSessions}
                    title="Sign Out of All Sessions?"
                    message="This will sign you out from all devices where you're currently logged in. You'll need to sign in again on each device."
                    confirmText="Sign Out All"
                    isDangerous={false}
                />
            )}

            {confirmationModal?.show && confirmationModal.type === 'deleteAccount' && (
                <ConfirmationModal
                    onClose={() => setConfirmationModal(null)}
                    onConfirm={handleDeleteAccount}
                    title="Delete Account Permanently?"
                    message="This action cannot be undone. All your data, including conversations and settings, will be permanently deleted."
                    confirmText="Delete Account"
                    cancelText="Keep Account"
                    isDangerous={true}
                />
            )}
        </>
    );
};
