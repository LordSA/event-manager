// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
import { UserRole } from '@/types/database.types';

export interface RBACPermissions {
  canViewPublic: boolean;
  canManageUsers: boolean;
  canCreateCommunities: boolean;
  canDeleteCommunities: boolean;
  canEditCommunity: (communityId: string) => boolean;
  canCreateEvents: (communityId: string) => boolean;
  canEditEvents: (communityId: string) => boolean;
  canDeleteEvents: (communityId: string) => boolean;
  canSetEventStatus: (communityId: string) => boolean;
}

export function getPermissions(role: UserRole | null, userCommunityId: string | null = null): RBACPermissions {
  const isSuperAdmin = role === 'dev' || role === 'admin';
  const isManager = role === 'manager';
  const isEditor = role === 'editor';

  return {
    canViewPublic: true,
    canManageUsers: isSuperAdmin,
    canCreateCommunities: isSuperAdmin,
    canDeleteCommunities: isSuperAdmin,
    canEditCommunity: (communityId: string) => {
      if (isSuperAdmin) return true;
      if (isManager && userCommunityId === communityId) return true;
      return false;
    },
    canCreateEvents: (communityId: string) => {
      if (isSuperAdmin) return true;
      if ((isManager || isEditor) && userCommunityId === communityId) return true;
      return false;
    },
    canEditEvents: (communityId: string) => {
      if (isSuperAdmin) return true;
      if ((isManager || isEditor) && userCommunityId === communityId) return true;
      return false;
    },
    canDeleteEvents: (communityId: string) => {
      if (isSuperAdmin) return true;
      if (isManager && userCommunityId === communityId) return true;
      return false;
    },
    canSetEventStatus: (communityId: string) => {
      if (isSuperAdmin) return true;
      if ((isManager || isEditor) && userCommunityId === communityId) return true;
      return false;
    }
  };
}
