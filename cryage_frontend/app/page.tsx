import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to test page
  redirect('/test');
}
