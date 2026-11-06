"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  updateProfile,
  changePassword,
  deleteAccount,
  signout,
} from "@/app/actions/auth";

export function AccountSettingsPanel() {
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [memberSince, setMemberSince] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setProfileName(data.user.name || "");
          setProfileEmail(data.user.email || "");
          setEmailVerified(!!data.user.emailVerified);
          setMemberSince(
            data.user.createdAt
              ? new Date(data.user.createdAt).toLocaleDateString()
              : "Active"
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    const formData = new FormData();
    formData.append("name", profileName);

    const res = await updateProfile(formData);
    setProfileLoading(false);

    if (res.success) {
      setProfileMsg({ text: res.message, type: "success" });
    } else {
      setProfileMsg({ text: res.message, type: "error" });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMsg(null);

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);

    const res = await changePassword(formData);
    setPwdLoading(false);

    if (res.success) {
      setPwdMsg({ text: res.message, type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setPwdMsg({ text: res.message, type: "error" });
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") {
      setDeleteMsg("Please type DELETE to confirm.");
      return;
    }

    setDeleteLoading(true);
    setDeleteMsg(null);

    const res = await deleteAccount(deleteConfirm);
    setDeleteLoading(false);

    if (res.success) {
      window.location.href = "/";
    } else {
      setDeleteMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
          Account & Security Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your enterprise profile, security credentials, and identity preferences.
        </p>
      </div>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
            {profileMsg && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                icon={<User className="h-4 w-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <Input
                value={profileEmail}
                disabled
                icon={<Mail className="h-4 w-4" />}
                className="bg-slate-50 text-slate-500"
              />
              <div className="flex items-center gap-2 pt-1">
                {emailVerified ? (
                  <Badge variant="emerald" size="sm" dot>
                    Verified Email
                  </Badge>
                ) : (
                  <Badge variant="amber" size="sm">
                    Pending Verification
                  </Badge>
                )}
                <span className="text-[11px] text-slate-400 font-mono">
                  Member since: {memberSince}
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={profileLoading}>
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            {pwdMsg && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {pwdMsg.text}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                placeholder="••••••••••••"
                required
              />
              <p className="text-[11px] text-slate-500">
                Must be at least 8 characters with letters, numbers, and symbols.
              </p>
            </div>

            <Button type="submit" variant="secondary" isLoading={pwdLoading}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="border-rose-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-rose-700">Danger Zone: Delete Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            Deleting your account will permanently remove your user identity, active sessions,
            and personal workspace configurations. This action cannot be undone.
          </p>

          <form onSubmit={handleDeleteAccount} className="space-y-3 max-w-md">
            {deleteMsg && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                {deleteMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Type <span className="font-mono text-rose-600 font-bold">DELETE</span> to confirm
              </label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                required
              />
            </div>

            <Button
              type="submit"
              variant="danger"
              disabled={deleteConfirm !== "DELETE" || deleteLoading}
              isLoading={deleteLoading}
            >
              Permanently Delete Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
