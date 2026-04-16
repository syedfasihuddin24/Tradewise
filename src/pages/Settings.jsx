import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateUserPassword } from '../services/authService';

const TABS = ['Profile', 'Security', 'Notifications', 'Preferences'];
const NOTIF_LABELS = [
  "Email me when my target price is hit",
  "Weekly portfolio performance summary",
  "Product updates and feature announcements",
  "Unusual volume or volatility alerts"
];

export default function Settings() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved]   = useState(false);
  const [saveError, setSaveError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const isGoogleUser = currentUser?.providerData?.some(p => p.providerId === 'google.com');

  // Initialize from LocalStorage or Defaults
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('tradewise_settings');
    if (saved) return JSON.parse(saved);
    return {
      displayName: currentUser?.displayName || 'Trader',
      currency: 'USD ($)',
      theme: 'Dark Mode (Default)',
      notifications: [true, true, false, false]
    };
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const toggleNotif = (idx) => {
    const newNotifs = [...formData.notifications];
    newNotifs[idx] = !newNotifs[idx];
    updateForm('notifications', newNotifs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);
    setSaveError('');

    try {
      // Handle password update explicitly if we're on security tab
      if (activeTab === 'Security' && !isGoogleUser && (currentPassword || newPassword)) {
        if (!currentPassword || !newPassword) {
          throw new Error("Both current and new password are required to change credentials.");
        }
        await updateUserPassword(currentUser, currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
      }

      // Handle standard local storage preferences savings
      localStorage.setItem('tradewise_settings', JSON.stringify(formData));
      
      if (formData.theme === 'Light Mode') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
      
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-white/40 text-sm">Manage your account preferences and settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {TABS.map((item) => (
             <button 
                key={item} 
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === item ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                {item}
             </button>
          ))}
        </div>
        <div className="md:col-span-2">
           <motion.div 
             key={activeTab} // Forces re-animation when tab changes
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ duration: 0.2 }}
             className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              
              <h3 className="text-lg text-white font-medium mb-6 pb-4 border-b border-white/5">{activeTab} Information</h3>
              
              {activeTab === 'Profile' && (
                <div className="space-y-5">
                   <div>
                     <label className="text-xs text-white/50 block mb-2 font-medium">Display Name</label>
                     <input 
                       type="text" 
                       value={formData.displayName} 
                       onChange={(e) => updateForm('displayName', e.target.value)}
                       className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors" 
                     />
                   </div>
                   <div>
                     <label className="text-xs text-white/50 block mb-2 font-medium">Email Address</label>
                     <input type="email" defaultValue={currentUser?.email || ''} className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors cursor-not-allowed" disabled />
                   </div>
                   <div>
                     <label className="text-xs text-white/50 block mb-2 font-medium">Role</label>
                     <input type="text" defaultValue="Pro Trader" className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors cursor-not-allowed text-white/50" disabled />
                   </div>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-5">
                   {isGoogleUser ? (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
                        <p className="text-sm text-blue-400 font-medium">Managed by Google</p>
                        <p className="text-xs text-white/50 mt-1">Your password and primary security settings are securely managed by your connected Google Account. Password resets must be done through Google.</p>
                      </div>
                   ) : (
                     <>
                       <div>
                         <label className="text-xs text-white/50 block mb-2 font-medium">Current Password</label>
                         <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors" />
                       </div>
                       <div>
                         <label className="text-xs text-white/50 block mb-2 font-medium">New Password</label>
                         <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors" />
                       </div>
                     </>
                   )}
                   <div className="flex items-center gap-3 pt-2">
                     <input type="checkbox" id="2fa" className="rounded border-white/10 bg-navy-900 accent-brand-500 w-4 h-4" defaultChecked />
                     <label htmlFor="2fa" className="text-sm text-white">Enable Two-Factor Authentication (2FA)</label>
                   </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="space-y-4">
                  {NOTIF_LABELS.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <input 
                         type="checkbox" 
                         id={`notif-${idx}`} 
                         checked={formData.notifications[idx]}
                         onChange={() => toggleNotif(idx)}
                         className="rounded border-white/10 bg-navy-900 accent-brand-500 w-4 h-4 cursor-pointer" 
                       />
                       <label htmlFor={`notif-${idx}`} className="text-sm text-white cursor-pointer">{label}</label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Preferences' && (
                <div className="space-y-5">
                   <div>
                     <label className="text-xs text-white/50 block mb-2 font-medium">Default Currency</label>
                     <select 
                       value={formData.currency}
                       onChange={(e) => updateForm('currency', e.target.value)}
                       className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors">
                       <option>USD ($)</option>
                       <option>EUR (€)</option>
                       <option>GBP (£)</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-white/50 block mb-2 font-medium">Theme</label>
                     <select 
                       value={formData.theme}
                       onChange={(e) => updateForm('theme', e.target.value)}
                       className="bg-navy-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-brand-500/50 transition-colors">
                       <option>Dark Mode (Default)</option>
                       <option>Light Mode</option>
                     </select>
                   </div>
                </div>
              )}

              <div className="pt-8 flex items-center justify-between">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`text-navy-900 text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,99,0.3)] min-w-[140px] flex items-center justify-center ${
                    isSaved ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-brand-500 hover:bg-brand-400'
                  } ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                    ) : isSaved ? (
                      'Saved!'
                    ) : (
                      'Save Changes'
                    )}
                </button>

                {saveError && (
                  <motion.p initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} className="text-xs text-red-400 font-medium ml-4">
                    {saveError}
                  </motion.p>
                )}

                {isSaved && !saveError && (
                  <motion.p initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} className="text-xs text-brand-400 ml-4">
                    Your preferences have been applied successfully.
                  </motion.p>
                )}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
