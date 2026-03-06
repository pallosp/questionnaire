'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/button/button';

export interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant="secondary"
      size="small"
      leftIcon="←"
      title="Back"
      onClick={() => router.back()}
    />
  );
}
