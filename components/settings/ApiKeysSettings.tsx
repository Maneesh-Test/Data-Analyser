import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { CopyIcon, EyeIcon, EyeOffIcon, CheckIcon, LoaderIcon } from '../Icons';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase/client';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created_at: string;
}

const generateApiKey = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'prism_';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

const NewKeyModal: React.FC<{ generatedKey: ApiKey; onClose: () => void }> = ({ generatedKey, onClose }) => {
    const { addToast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedKey.key);
        setCopied(true);
        addToast("API key copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">API Key Generated</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Please copy this key and store it securely. You will not be able to see it again.
                </p>
                <div className="relative my-4">
                    <input type="text" readOnly value={generatedKey.key} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-3 pr-12 font-mono text-sm" />
                    <button onClick={handleCopy} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        {copied ? <CheckIcon className="w-5 h-5 text-emerald-500" /> : <CopyIcon className="w-5 h-5" />}
                    </button>
                </div>
                <div className="flex justify-end">
                    <Button onClick={onClose} variant="teal">Done</Button>
                </div>
            </div>
        </div>
    );
};


export const ApiKeysSettings: React.FC = () => {
    const { addToast } = useToast();
    const { user } = useAuth();

    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);

    useEffect(() => {
        const fetchKeys = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            };
            
            setIsLoading(true);
            const { data, error } = await supabase
                .from('user_api_keys')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                addToast(`Could not fetch API keys: ${error.message}`, 'error');
                console.error('Supabase fetch error:', error);
            } else {
                setKeys(data as ApiKey[]);
            }
            setIsLoading(false);
        };
        fetchKeys();
    }, [user, addToast]);

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim() || !user) return;
        
        const newKeyData = {
            name: newKeyName,
            key: generateApiKey(),
            user_id: user.id
        };
        
        const { data, error } = await supabase
            .from('user_api_keys')
            .insert(newKeyData)
            .select()
            .single();
            
        if (error) {
            addToast(`Failed to generate key: ${error.message}`, 'error');
        } else if (data) {
            const newKey = data as ApiKey;
            setKeys(prev => [newKey, ...prev]);
            setGeneratedKey(newKey);
            setIsCreating(false);
            setNewKeyName('');
        }
    };

    const handleRevokeKey = async (id: string) => {
        const keyToRevoke = keys.find(k => k.id === id);
        if (!keyToRevoke) return;

        const { error } = await supabase
            .from('user_api_keys')
            .delete()
            .eq('id', id);

        if (error) {
             addToast(`Failed to revoke key: ${error.message}`, 'error');
        } else {
            setKeys(prev => prev.filter(key => key.id !== id));
            addToast(`API Key "${keyToRevoke.name}" has been revoked.`, "success");
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-8 md:p-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">API Keys</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage API keys to use Prism AI services in your applications.
                        </p>
                    </div>
                    {!isCreating && <Button onClick={() => setIsCreating(true)} variant="teal" className="w-full sm:w-auto">Generate New Key</Button>}
                </div>

                {isCreating && (
                    <form onSubmit={handleGenerateKey} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50 mb-8">
                        <h3 className="font-semibold mb-2">Create a new API key</h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="Enter a descriptive name (e.g., My Web App)"
                                className="flex-grow bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm"
                                required
                            />
                            <Button type="submit" variant="teal">Generate</Button>
                            <Button onClick={() => setIsCreating(false)} variant="secondary">Cancel</Button>
                        </div>
                    </form>
                )}

                <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Key</th>
                                <th scope="col" className="px-6 py-3">Created</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                           {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <LoaderIcon className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                                    </td>
                                </tr>
                           ) : keys.length > 0 ? keys.map(key => (
                                <tr key={key.id} className="border-b dark:border-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{key.name}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{key.key.slice(0, 10)}...{key.key.slice(-4)}</td>
                                    <td className="px-6 py-4">{new Date(key.created_at).toLocaleDateString('en-US')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleRevokeKey(key.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        You haven't generated any API keys yet.
                                    </td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                </div>
            </div>
            {generatedKey && <NewKeyModal generatedKey={generatedKey} onClose={() => setGeneratedKey(null)} />}
        </>
    );
};