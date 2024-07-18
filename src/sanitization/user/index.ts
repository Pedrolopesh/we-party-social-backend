import { CreateUserProfileParams } from "types/UserProfile";

export const userInputSanitization = (
  body: CreateUserProfileParams | undefined
) => {
  const requiredFields = [
    "name",
    "password",
    "email",
    "acceptedTerms",
    "notificationActive",
    "mongoUserId",
  ];

  for (const field of requiredFields) {
    if (!body?.[field as keyof CreateUserProfileParams]) {
      return {
        status: 400,
        body: `Field ${field} is required`,
      };
    }
  }

  if (!body) {
    return {
      status: 400,
      body: "Body is required",
    };
  }

  return {
    name: body.name,
    email: body.email,
    acceptedTerms: body.acceptedTerms,
    notificationActive: body.notificationActive,
  };
};
