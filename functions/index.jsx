import getCollegeDetailsApi from "./getCollegeDetailsApi";

export { default as registerUser } from "./registerApi";
export { default as loginUser } from "./loginApi";
export { default as logoutApi } from "./logoutApi";
export { default as generateOtpApi } from "./generateOtp";
export { default as resetPasswordApi } from "./resetPasswordApi";
export { default as resetUserNameApi } from "./resetUserNameApi";
export { default as getCollegeDetailsApi } from "./getCollegeDetailsApi";
// applicant

export { default as updateAppplicantData } from "./Applicant/updateApplicant";
export { default as getApplicantsByYearApi } from "./Applicant/getApplicantsByYearApi";
export { default as getSingleApplicantApi } from "./Applicant/getSingleApplicantApi";
export { default as getApplicantsByYear } from "./Applicant/getApplicantsByYearApi";
export { default as deleteApplicantsByYear } from "./Applicant/deleteApplicantsByYearApi";
export { default as deleteSingleApplicantApi } from "./Applicant/deleteSingleApplicantApi";

// provider
export { default as createAccountWithSocialPlatform } from "./providers/createAccountWithSocialPlatform";
export { default as logIntoAccountWithSocialPlatform } from "./providers/logIntoAccountWithSocialPlatform";
