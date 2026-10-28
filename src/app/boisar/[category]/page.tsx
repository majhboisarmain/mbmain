import { permanentRedirect } from 'next/navigation';
import { getCategorySlug } from '@/lib/categories';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function BoisarCategoryRedirect({ params }: Props) {
  const { category } = await params;
  const canonicalSlug = getCategorySlug(category) || category.toLowerCase();
  permanentRedirect(`/category/${canonicalSlug}`);
}
