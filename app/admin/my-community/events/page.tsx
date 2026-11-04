'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyCommunityEventsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/my-community');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
        Redirecting to My Community workspace...
      </div>
    </div>
  );
}
