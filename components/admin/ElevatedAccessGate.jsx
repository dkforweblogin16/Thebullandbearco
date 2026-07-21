// FILE PATH: components/admin/ElevatedAccessGate.jsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ShieldCheck, ShieldAlert, Lock, X } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

// ---------------------------------------------------------------------
// Tier 2 of admin access: "elevated control".
//
// Any signed-in admin (tier 1) can view every /admin page. But the
// moment they try to add/edit/delete anything, the server replies with
// { code: "elevated_required" } unless this browser also holds a valid
// passcode session. lib/adminApi.js catches that and fires a window
// event, which this provider listens for globally, so the unlock modal
// pops up automatically no matter which page/button triggered it.
// ---------------------------------------------------------------------

const ElevatedAccessContext = createContext({
  elevated: false,
  checking: true,
  openGate: () => {},
  lock: () => {},
});

export function useElevatedAccess() {
  return useContext(ElevatedAccessContext);
}

export function ElevatedAccessProvider({ children }) {
  const [elevated, setElevated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [gateOpen, setGateOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    adminFetch("/api/admin/elevate")
      .then((res) => setElevated(Boolean(res.elevated)))
      .catch(() => setElevated(false))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    refresh();
    function onRequired() {
      setGateOpen(true);
    }
    window.addEventListener("admin:elevated-required", onRequired);
    return () => window.removeEventListener("admin:elevated-required", onRequired);
  }, [refresh]);

  function openGate() {
    setError("");
    setPasscode("");
    setGateOpen(true);
  }

  async function lock() {
    try {
      await adminFetch("/api/admin/elevate", { method: "DELETE" });
    } catch {
      // ignore — we still flip the UI to locked either way
    }
    setElevated(false);
  }

  async function handleUnlock(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminFetch("/api/admin/elevate", {
        method: "POST",
        body: JSON.stringify({ passcode }),
      });
      setElevated(true);
      setGateOpen(false);
      setPasscode("");
    } catch (err) {
      setError(err.message || "Incorrect passcode.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ElevatedAccessContext.Provider value={{ elevated, checking, openGate, lock }}>
      {children}

      {gateOpen && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={handleUnlock}
            className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lock size={16} className="text-amber-600" />
                </div>
                <h2 className="font-semibold text-base">Unlock Full Control</h2>
              </div>
              <button
                type="button"
                onClick={() => setGateOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-2 mb-4">
              Adding, editing, or deleting anything needs the access passcode.
              It stays unlocked for 1 hour, then locks again automatically.
            </p>
            <input
              autoFocus
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Access passcode"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-slate-900"
            />
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            <button
              disabled={busy}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm mt-4 disabled:opacity-60"
            >
              {busy ? "Checking..." : "Unlock"}
            </button>
          </form>
        </div>
      )}
    </ElevatedAccessContext.Provider>
  );
}

// Small status pill for the sidebar/topbar showing lock state, with a
// one-click way to unlock or re-lock.
export function ElevationStatusPill() {
  const { elevated, checking, openGate, lock } = useElevatedAccess();

  if (checking) return null;

  if (elevated) {
    return (
      <button
        onClick={lock}
        title="Click to lock full control again"
        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded-full hover:bg-emerald-400/20"
      >
        <ShieldCheck size={13} /> Unlocked
      </button>
    );
  }

  return (
    <button
      onClick={openGate}
      title="Enter the passcode to add, edit, or delete"
      className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-300/10 px-2.5 py-1.5 rounded-full hover:bg-amber-300/20"
    >
      <ShieldAlert size={13} /> View only
    </button>
  );
}
