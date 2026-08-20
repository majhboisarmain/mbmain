import { redirect } from 'next/navigation';

export default function PropertiesPage() {
  // Direct visitors to the homepage with active real estate category
  redirect('/?portal=properties');
}
