
export const prepareWelcomeEmails = (createdUsers: any[], dataWithIds: any[]) => {
  return createdUsers.filter(Boolean).map((user, idx) => {
    const userData = dataWithIds[idx];

    return {
      to: [user?.email as string],
      username: user?.name as string,
      data: {
        lastName: userData.lastName,
        email: userData.email,
        password: user?.password as string,
      },
    };
  });
};
