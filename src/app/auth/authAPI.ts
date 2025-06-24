// auth/authAPI.ts

export const loginUser = async (email: string, password: string) => {
  if (email === "test@example.com" && password === "123456") {
    return {
      success: true,
      token: "demo-token",
      user: { name: "Test User", email },
    };
  }
  return { success: false, message: "Invalid credentials" };
};

export const registerUser = async (formData: any) => {
  return {
    success: true,
    token: "new-user-token",
    user: { name: formData.name, email: formData.email },
  };
};

export const resetPassword = async (email: string) => {
  return { success: true, message: "Reset link sent to your email." };
};



export const logoutUser = async () => {
  return { success: true, message: "Logout !" };
};