/**
 * Extrahiert die ersten Buchtsaben der Namen vom User.
 * @param displayName - der ganze name
 * @returns die ersten Buchstaben oder ?
 */
let firstName = "";
let lastName = "";
let initials = "";

export const getUserNameParts = (displayName: string | null | undefined) => {
  if (!displayName) {
    return {
      firstName: "?",
      lastName: "?",
      initials: "?",
    };
  }

  const nameParts = displayName.trim().split(" ");
  const firstName = nameParts[0] ?? "?";
  const lastName = nameParts.length > 1 ? nameParts[1] : "?";
  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const lastNameInitial = lastName.charAt(0).toUpperCase();
  const initials = `${firstNameInitial}${lastNameInitial}`;

  return {
    firstName,
    lastName,
    initials,
  };
};
