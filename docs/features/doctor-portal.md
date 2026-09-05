# 13. Doctor Portal## 13.1 OverviewThe MedConnect AI Doctor Portal is a professional healthcare workspace that enables doctors to manage patients, appointments, consultations, prescriptions, medical records, and AI-assisted clinical workflows from a single platform.The Doctor Portal should be designed primarily for clinical productivity.Doctor Portal Principle: Less administration. More patient care.The interface should allow a doctor to quickly move from:Dashboard
    ↓
Today's Appointments
    ↓
Patient
    ↓
Consultation
    ↓
AI Assistance
    ↓
Prescription
    ↓
Follow-up
# 13.2 Doctor Portal ObjectivesThe portal should enable doctors to:Manage their professional profile.Manage availability.View appointments.Conduct online consultations.Access patient information.Review medical reports.Use AI-assisted tools.Create e-prescriptions.Maintain consultation history.Manage follow-ups.Communicate with patients.Track earnings where applicable.Manage notifications.Access professional analytics.# 13.3 Doctor Portal User Roles### Primary DoctorFull clinical functionality.### Clinic DoctorDoctor associated with a clinic/hospital.

          
            
          
        
  
        
    

Senior/Lead DoctorMay have additional clinic-level visibility.### Future RolesNurseMedical AssistantReceptionistClinic AdministratorRole-based permissions must prevent unauthorized access to patient information.# 13.4 Doctor Authentication## Login----------------------------------
MedConnect AI

Doctor Login

Email / Mobile Number

Password

[ Login ]

Forgot Password?

[ Login with OTP ]
----------------------------------
Optional future authentication:Two-factor authenticationBiometric authenticationSSO# 13.5 Doctor VerificationDoctors should complete professional verification before receiving patients.Verification information may include:Full NameMedical Registration NumberMedical CouncilQualificationSpecializationExperienceClinic/HospitalIdentity documentsProfessional documentsVerification status:Pending
   ↓
Under Review
   ↓
Verified
   ↓
Active
Unverified doctors should not be allowed to issue finalized prescriptions or provide services requiring verification.# 13.6 Doctor OnboardingInitial onboarding:Create Account
      ↓
Verify Mobile/Email
      ↓
Professional Information
      ↓
Upload Documents
      ↓
Profile Setup
      ↓
Availability
      ↓
Consultation Preferences
      ↓
Verification
      ↓
Doctor Dashboard
# 13.7 Doctor DashboardThe dashboard is the primary workspace.------------------------------------------------
Good Morning, Dr. Sharma

[ + New Consultation ]

Today's Overview

Appointments        Patients
    12                 38

Pending Follow-ups   Prescriptions
     5                  16

------------------------------------------------

Today's Schedule

09:30  Patient A
10:00  Patient B
10:30  Patient C

------------------------------------------------

Quick Actions

[Appointments]
[Patients]
[Prescriptions]
[Reports]

------------------------------------------------
# 13.8 Dashboard WidgetsRecommended widgets:### Today's AppointmentsShows:PatientTimeConsultation typeStatus

          
            
          
        
  
        
    

Pending ConsultationsPatients waiting to be attended.### Follow-upsUpcoming patient follow-ups.### Recent PatientsRecently consulted patients.

          
            
          
        
  
        
    

Prescription ActivityRecently issued prescriptions.### NotificationsImportant alerts.### AI InsightsOptional clinical productivity insights.# 13.9 Doctor NavigationRecommended desktop navigation:Dashboard

Appointments
Patients
Consultations
Prescriptions
Medical Records
AI Tools
Messages
Availability
Earnings
Analytics

Settings
Help
Sidebar should remain persistent on desktop.Mobile/tablet can use:Home
Appointments
Patients
More
# 13.10 Appointment ManagementDoctor can:View appointmentsAccept appointmentsReject where applicableRescheduleCancelStart consultationMark no-showComplete consultationAppointment statuses:Requested
Confirmed
Upcoming
Waiting
In Consultation
Completed
Cancelled
No Show
# 13.11 Appointment CalendarCalendar views:DayWeekMonthExample:MON     TUE     WED     THU     FRI

09:00
Patient A

10:00
Patient B

11:00
Patient C
Filters:Video consultationIn-personFollow-upNew patient# 13.12 Availability ManagementDoctors can define:Working daysWorking hoursBreaksConsultation durationMaximum appointmentsOnline availabilityOffline availabilityExample:Monday

09:00 AM – 01:00 PM
02:00 PM – 05:00 PM

Consultation:
20 minutes

[Save Availability]
# 13.13 Appointment TypesSupported:Video ConsultationAudio ConsultationIn-Person ConsultationFollow-upFuture:Home Visit# 13.14 Patient ManagementPatient list:Patients

Search Patient

Name | Age | Last Visit | Next Follow-up

Patient A
Patient B
Patient C

[View Patient]
Filters:RecentFollow-upChronic careNew patient# 13.15 Patient ProfileDoctor view:Patient

Name
Age
Gender
Patient ID

--------------------------------

Medical Summary

Allergies
Conditions
Current Medicines

--------------------------------

Appointments

Prescriptions

Reports

Timeline
Doctors should only see information they are authorized to access.# 13.16 Patient Medical Timeline2026

Aug 22
Consultation
Dr. Sharma

Aug 22
Prescription

Aug 24
Lab Report

Aug 30
Follow-up
Timeline provides contextual patient history without forcing doctors to search through multiple modules.# 13.17 Medical ReportsDoctors can:View reportsDownload reportsUpload reportsReview OCR dataView AI analysisAdd notesReport types:Blood reportsImagingPrescriptionsClinical documentsOther medical files# 13.18 Consultation WorkspaceThe consultation screen should be the doctor's most important workspace.------------------------------------------------
Patient Information

Patient: Rahul
Age: 42

------------------------------------------------

Symptoms / Chief Complaint

[ Clinical Notes ]

------------------------------------------------

Medical History

Allergies
Current Medication

------------------------------------------------

Reports

[Report 1] [Report 2]

------------------------------------------------

AI Assistant

[AI Assistance]

------------------------------------------------

Prescription

[Create Prescription]

------------------------------------------------
# 13.19 Video ConsultationVideo consultation should provide:CameraMicrophoneSpeakerScreen sharingIn-call chatReport sharingPrescription accessConsultation notesExample:------------------------------------------------
Patient Video

                 Patient

------------------------------------------------

[Mic] [Camera] [Chat] [Share] [End Call]

------------------------------------------------

Patient Information
AI Assistant
Notes
Prescription
------------------------------------------------
# 13.20 Waiting RoomBefore joining:Patient is waiting

Rahul Kumar

Camera: Ready
Microphone: Ready

[Join Consultation]
# 13.21 In-Call Patient ContextDoctors should be able to access relevant patient information while remaining in the consultation.Tabs:Overview
Reports
Prescriptions
Timeline
Notes
AI
# 13.22 AI Clinical AssistantThe AI assistant should be positioned as a decision-support tool, not an autonomous doctor.Possible capabilities:Summarize consultationExtract symptomsOrganize clinical notesSummarize previous reportsSuggest questionsHighlight missing informationExplain medical reportsGenerate draft consultation summaryDoctor must review AI-generated information before using it clinically.# 13.23 AI Consultation SummaryAfter consultation:AI Consultation Summary

Chief Complaint:
...

Symptoms:
...

Relevant History:
...

Clinical Findings:
...

Plan:
...

Follow-up:
...

[Review]
[Edit]
[Save]
The doctor must explicitly approve the final record.# 13.24 E-PrescriptionDoctor can create an electronic prescription.Flow:Consultation
     ↓
Create Prescription
     ↓
Diagnosis
     ↓
Medicines
     ↓
Investigations
     ↓
Advice
     ↓
Follow-up
     ↓
Preview
     ↓
Authenticate
     ↓
Issue
     ↓
Share With Patient
The standalone E-Prescription module defined previously should eventually become a service within the Doctor Portal.# 13.25 Prescription HistoryDoctors can view:Prescription IDPatientDateStatusVersionActions:ViewDownloadDuplicateCreate updated versionIssued prescriptions should not be silently overwritten.# 13.26 Prescription TemplatesDoctors can create templates for frequently used workflows.Examples:General Consultation
Fever
Hypertension Follow-up
Diabetes Follow-up
Template must always be reviewed before issuing.# 13.27 Doctor NotesDoctors can maintain private clinical notes where appropriate.Notes should have clear visibility rules:Private Clinical Note
Patient-visible Note
Prescription Instruction
These must not be accidentally mixed.# 13.28 ReferralDoctor can create referrals.Fields:Referral specialistReasonClinical summarySupporting documentsUrgencyFuture integration:Doctor
 ↓
Referral
 ↓
Specialist Search
 ↓
Appointment
# 13.29 MessagingDoctor-patient messaging can support:Text messagesPrescription clarificationFollow-up communicationDocument sharingThe product should define appropriate boundaries for asynchronous medical communication.# 13.30 NotificationsDoctor notifications:New appointmentAppointment reminderPatient waitingPrescription deliveredFollow-up duePatient messageSystem notification# 13.31 Doctor ProfilePublic profile:PhotoNameQualificationSpecializationExperienceLanguagesConsultation feeConsultation typesAvailabilityClinicVerification badge# 13.32 Professional SettingsDoctors can manage:ProfileClinicAvailabilityConsultation feeConsultation typesNotificationsSecurityDocumentsSignatureAccount# 13.33 EarningsIf payments are integrated:Earnings

Today
₹4,500

This Week
₹22,500

This Month
₹85,000

Pending Settlement
₹12,000
Features:Transaction historySettlement statusPayment reportsInvoice access# 13.34 Doctor AnalyticsAnalytics may include:Number of consultationsCompleted consultationsCancellation rateNo-show ratePatient countFollow-upsPrescription countAverage consultation durationClinical analytics should avoid encouraging unsafe volume-based care.# 13.35 Doctor Portal Screen MatrixIDScreenPriorityD-001Doctor SplashMVPD-002Doctor LoginMVPD-003RegistrationMVPD-004OTP VerificationMVPD-005Professional VerificationMVPD-006OnboardingMVPD-007DashboardMVPD-008Appointment CalendarMVPD-009Appointment DetailsMVPD-010AvailabilityMVPD-011Patient ListMVPD-012Patient ProfileMVPD-013Patient TimelineMVPD-014Medical ReportsMVPD-015Consultation WorkspaceMVPD-016Waiting RoomMVPD-017Video ConsultationMVPD-018Consultation NotesMVPD-019AI AssistantMVPD-020AI SummaryMVPD-021Prescription BuilderMVPD-022Prescription PreviewMVPD-023Prescription AuthenticationMVPD-024Prescription SuccessMVPD-025Prescription HistoryMVPD-026Prescription DetailsMVPD-027Prescription TemplatesPhase 2D-028ReferralPhase 2D-029MessagesMVPD-030NotificationsMVPD-031Doctor ProfileMVPD-032Clinic ProfilePhase 2D-033EarningsPhase 2D-034AnalyticsPhase 2D-035SettingsMVPD-036Privacy &amp; SecurityMVPD-037Help &amp; SupportMVPD-038LogoutMVP# 13.36 Doctor Portal Design Principles

          
            
          
        
  
        
    

Clinical FirstClinical information should be more prominent than administrative information.### FastCommon tasks should require minimum clicks.### StructuredUse structured fields wherever they improve accuracy.

          
            
          
        
  
        
    

Human ControlledAI should assist doctors, never silently make clinical decisions.### SecurePatient information should only be accessible to authorized users.### ContextualPatient information should be available inside the consultation workflow.# 13.37 Doctor Portal Main FlowLOGIN
  ↓
VERIFICATION
  ↓
DASHBOARD
  ↓
APPOINTMENTS
  ↓
PATIENT
  ↓
CONSULTATION
  ↓
AI ASSISTANCE
  ↓
MEDICAL NOTES
  ↓
PRESCRIPTION
  ↓
AUTHENTICATION
  ↓
PATIENT RECEIVES PRESCRIPTION
  ↓
FOLLOW-UP
# 13.38 Claude Design InstructionsClaude Design should create the Doctor Portal as a professional clinical SaaS platform.It should feel closer to:A modern digital doctor's workstationrather than a consumer healthcare application.Desktop should be the primary design target because doctors may use large screens during consultations.Mobile and tablet versions should still be supported.# 13.39 Doctor Portal Success CriteriaThe portal is successful when a doctor can:Login securely.View today's schedule.Open a patient.Review relevant medical history.Start a consultation.Conduct video consultation.Review reports.Use AI assistance.Write clinical notes.Create an e-prescription.Authenticate the prescription.Send it to the patient.Schedule follow-up.Review the patient's future history.The complete workflow should be possible without repeatedly switching between unrelated screens.