import myFetch from '@/lib/requestHelper';

const fetchUser = async (userId: string) => {
  try {
      const res = await myFetch(`/api/admin/users/${userId}`, )
  const data = await res.json()
      return data;
  } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
  }
}

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  
  const { userId } = await params;
  const userData = await fetchUser(userId);

  if (!userData || (typeof userData.ok !== 'undefined' && !userData.ok)) {
    return <div>Error loading user details.</div>;
  }

  return (
    <div>{JSON.stringify(userData)}</div>
  );
}

