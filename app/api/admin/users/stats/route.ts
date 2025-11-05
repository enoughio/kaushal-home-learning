
export const GET = async () => {
  try {
    return new Response(
        JSON.stringify({
            totalUsers: 1500,
            activeUsers: 1234,
            newUsersThisMonth: 45,
        }),
        { status: 200 }
    );
  }
    catch{
    return new Response(
        JSON.stringify({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        }),
        { status: 500 }
    );
  }
};