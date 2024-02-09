export interface InstituteAdminDetailsChangingHistoryVO {
  id: number;
  userId: number;
  instituteId: number;

  oldMobileOtp: string;
  newMobileOtp: string;

  oldMobileNumber: string;
  newMobileNumber: string;

  oldOtpSentDate: Date;
  newOtpSentDate: Date;
  updatedDate: Date;

  updatedBy: number;
  otpResendFor: string;

  isVerified: boolean;
}
