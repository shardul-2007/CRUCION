"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  UserPlus,
  Shield,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createOrganizationAction,
  inviteOrgMemberAction,
  removeOrgMemberAction,
} from "@/app/actions/workspace";

interface OrganizationInfo {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface MemberInfo {
  member: {
    id: string;
    organizationId: string;
    userId?: string;
    invitedEmail?: string;
    role: string;
    status: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export function OrganizationPanel() {
  const [organizations, setOrganizations] = useState<OrganizationInfo[]>([]);
  const [activeOrg, setActiveOrg] = useState<OrganizationInfo | null>(null);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchOrgs = async () => {
    try {
      const res = await fetch("/api/organizations");
      if (res.ok) {
        const data = await res.json();
        const list = (data.organizations || []).map((o: { organization: OrganizationInfo }) => o.organization);
        setOrganizations(list);
        if (list.length > 0 && !activeOrg) {
          setActiveOrg(list[0]);
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", newOrgName.trim());

    const res = await createOrganizationAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: "success" });
      setNewOrgName("");
      await fetchOrgs();
    } else {
      setMessage({ text: res.message, type: "error" });
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !inviteEmail.trim()) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("organizationId", activeOrg.id);
    formData.append("email", inviteEmail.trim());
    formData.append("role", inviteRole);

    const res = await inviteOrgMemberAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: "success" });
      setInviteEmail("");
    } else {
      setMessage({ text: res.message, type: "error" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
            Organizations & RBAC Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage multi-tenant engineering teams, assign roles, and isolate container projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue" size="md">
            CRUCION TRUST
          </Badge>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Organizations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Organizations</CardTitle>
            <span className="text-xs text-slate-500 font-mono">
              {organizations.length} Active Workspaces
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {organizations.map((org) => {
              const isSelected = activeOrg?.id === org.id;
              return (
                <div
                  key={org.id}
                  onClick={() => setActiveOrg(org)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0066cc] bg-sky-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{org.name}</span>
                    <Badge variant="blue" size="sm">
                      {org.plan} Plan
                    </Badge>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    Slug: {org.slug}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Create Organization Form */}
          <form onSubmit={handleCreateOrg} className="pt-2 flex flex-col sm:flex-row gap-2">
            <Input
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="New Organization Name (e.g. Acme Corp Labs)"
              icon={<Building2 className="h-4 w-4" />}
              className="flex-1"
            />
            <Button type="submit" variant="secondary" isLoading={loading}>
              <Plus className="h-4 w-4" />
              <span>Create Org</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Team Members & Roles for Active Organization */}
      {activeOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{activeOrg.name} — Team Members</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Enforce least-privilege access across microVM containers and deployment gates.
                </p>
              </div>
              <Badge variant="emerald" size="sm">
                Active Tenant
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invite Form */}
            <form onSubmit={handleInviteMember} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="font-semibold text-xs text-slate-900">Invite Team Member</div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-7">
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="MEMBER">Member (Developer)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                    <option value="VIEWER">Viewer (Read-Only)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                    <UserPlus className="h-4 w-4" />
                    <span>Invite</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Roles Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 font-mono text-[11px] text-slate-500 flex justify-between uppercase">
                <span>Member Identity</span>
                <span>Role & Permissions</span>
              </div>
              <div className="p-3 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-[11px]">
                    CR
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Current Workspace Owner</div>
                    <div className="text-[11px] text-slate-400 font-mono">Primary Administrator</div>
                  </div>
                </div>
                <Badge variant="blue" size="sm">
                  OWNER
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
