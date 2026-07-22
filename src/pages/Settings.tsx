import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Save, Shield, Key, Eye, EyeOff, 
  Globe, BellRing, RefreshCw, AlertCircle
} from 'lucide-react';
import { Button, Input, Select } from '../components/common/UIComponents';

export default function Settings() {
  // Org Settings State
  const [orgName, setOrgName] = useState('Velora Industrial Group');
  const [adminEmail, setAdminEmail] = useState('operations@velora.com');
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [threshold, setThreshold] = useState(15);
  
  // UI Settings State
  const [layoutDensity, setLayoutDensity] = useState('default');
  const [enableMfa, setEnableMfa] = useState(true);
  const [notifyOnLowStock, setNotifyOnLowStock] = useState(true);

  // Security Credentials state
  const [apiKey, setApiKey] = useState('vel_live_99d12a83f912e87c093a');
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRegenerateKey = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const hex = Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setApiKey(`vel_live_${hex}`);
      setIsRegenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-accent" />
          Suite Settings
        </h1>
        <p className="text-xs text-muted-foreground">Configure organization preferences, secure API integrations, and layout behaviors.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Core Config Card */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 dark:border-zinc-800/80 pb-3">
            <Globe className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Organization Profile & Localization</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
            <Input
              label="Administrative Email Address"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Base Currency"
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' }
              ]}
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            />
            <Input
              label="Low Inventory Alert Threshold (%)"
              type="number"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* User Preferences and Preferences */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 dark:border-zinc-800/80 pb-3">
            <BellRing className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Notification Settings & Density</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/40 dark:border-zinc-800/40">
              <div>
                <p className="text-xs font-bold text-foreground">Low Stock System Alerts</p>
                <p className="text-[10px] text-muted-foreground">Receive real-time dashboard notifications when inventory drops below the threshold limit.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnLowStock}
                onChange={(e) => setNotifyOnLowStock(e.target.checked)}
                className="w-4 h-4 rounded text-accent border-border dark:border-zinc-800 focus:ring-accent bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/40 dark:border-zinc-800/40">
              <div>
                <p className="text-xs font-bold text-foreground">Multi-Factor Authentication (MFA)</p>
                <p className="text-[10px] text-muted-foreground">Add an additional security verification step during sign-in attempts.</p>
              </div>
              <input
                type="checkbox"
                checked={enableMfa}
                onChange={(e) => setEnableMfa(e.target.checked)}
                className="w-4 h-4 rounded text-accent border-border dark:border-zinc-800 focus:ring-accent bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Select
                label="Layout Density"
                options={[
                  { value: 'default', label: 'Default - Standard spacing' },
                  { value: 'cozy', label: 'Cozy - Optimized lists' },
                  { value: 'compact', label: 'Compact - High density data view' }
                ]}
                value={layoutDensity}
                onChange={(e) => setLayoutDensity(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 dark:border-zinc-800/80 pb-3">
            <Key className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Integrations & API Credentials</h2>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Use the credentials below to connect your internal warehouses, ERP modules, or barcode scanners to the Velora API endpoints.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  readOnly
                  value={apiKey}
                  className="w-full px-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-secondary/50 dark:bg-black/20 text-foreground font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isRegenerating}
                onClick={handleRegenerateKey}
                className="flex items-center gap-1.5 text-xs font-semibold py-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate Key
              </Button>
            </div>
          </div>
        </div>

        {/* Error/Success and Save */}
        <div className="flex items-center justify-between gap-4">
          <div>
            {saveSuccess && (
              <div className="flex items-center gap-2 text-[#099268] text-xs font-bold animate-in fade-in duration-200">
                <Shield className="w-4 h-4" />
                <span>All suite preferences saved successfully!</span>
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="flex items-center gap-2 text-xs font-bold py-2.5 px-6 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
