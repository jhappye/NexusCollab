'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SettingsLayout } from '@/components/workspace/settings-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Mail, Loader2, Crown, UserMinus } from 'lucide-react';

interface Member {
  id: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Invite {
  id: string;
  email: string;
  createdAt: string;
}

export default function MembersSettingsPage() {
  const { wsId } = useParams<{ wsId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [wsRes, invitesRes] = await Promise.all([
        fetch(`/api/workspace/${wsId}`),
        fetch(`/api/workspace/${wsId}/invites`),
      ]);
      const wsData = await wsRes.json();
      const invitesData = await invitesRes.json();
      setMembers(wsData.workspace?.members ?? []);
      setInvites(invitesData.invites ?? []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [wsId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviting(true);
    try {
      const res = await fetch(`/api/workspace/${wsId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvites(data.invites ?? []);
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to invite:', error);
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // In a real app, this would call an API to update the role
    setMembers(prev =>
      prev.map(m => (m.userId === userId ? { ...m, role: newRole as Member['role'] } : m))
    );
  };

  const handleRemoveMember = async (userId: string) => {
    // In a real app, this would call an API to remove the member
    setMembers(prev => prev.filter(m => m.userId !== userId));
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.slice(0, 2).toUpperCase();
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'default';
      case 'MEMBER':
        return 'secondary';
      case 'VIEWER':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <SettingsLayout wsId={wsId} currentTab="members">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout wsId={wsId} currentTab="members">
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage workspace members and their roles.
          </p>
        </div>

        {/* Invite Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invite by Email
          </h3>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="max-w-xs"
            />
            <Button type="submit" disabled={inviting || !email.trim()}>
              {inviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                'Invite'
              )}
            </Button>
          </form>

          {/* Pending Invites */}
          {invites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Pending Invites
              </h4>
              <div className="space-y-2">
                {invites.map(invite => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="text-sm">{invite.email}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members ({members.length})
          </h3>
          <div className="space-y-2">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 px-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs">
                      {getInitials(member.user.name, member.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.user.name || member.user.email}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                    {member.role === 'ADMIN' && <Crown className="h-3 w-3" />}
                    {member.role}
                  </Badge>
                  <Select
                    value={member.role}
                    onValueChange={value => handleRoleChange(member.userId, value)}
                  >
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400"
                    onClick={() => handleRemoveMember(member.userId)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
