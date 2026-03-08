import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Plans',
  description:
    'Upload your building plans and project documents for a preliminary cost review from Akers Development. Get an early budgeting range and project insight.',
  keywords: [
    'upload building plans',
    'construction cost estimate',
    'house build cost review',
    'preliminary cost review',
    'building cost estimate Mississippi',
  ],
};

export default function UploadPlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
