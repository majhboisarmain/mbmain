import { redirect } from 'next/navigation';

export default function ListBusinessPage() {
  redirect('/dashboard?register=true');
}
