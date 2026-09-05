# 12 - Patient Application (Part 1)# App Overview, Design Principles, User Flow &amp; Authentication---# OverviewThe **Patient Application** is the primary interface of MedConnect AI, designed to provide users with an intelligent, secure, and seamless digital healthcare experience.Unlike conventional healthcare applications that separate consultations, medical records, AI assistance, and healthcare services into different platforms, MedConnect AI brings everything together in one AI-powered ecosystem.The application should feel **simple enough for first-time users** while remaining powerful enough for users managing chronic conditions, families, and long-term health records.---# Product Vision&gt; **"One Intelligent Healthcare Companion for Every Patient."**The patient application should become the user's everyday healthcare companion by providing:- AI-powered health guidance- Doctor discovery- Appointment booking- Video consultation- Medical Wallet- AI report understanding- Medicine reminders- Health education- Emergency support---# Primary Goals- Make healthcare accessible- Reduce healthcare complexity- Provide AI-powered assistance- Improve preventive healthcare- Create a lifelong digital health record- Deliver an excellent mobile-first experience---# Design PhilosophyThe MedConnect AI Patient App should be designed around six core principles.---## 1. SimplicityHealthcare should never feel complicated.Users should accomplish important tasks in as few steps as possible.Examples:- Book a doctor within 60 seconds- Upload a report within 3 taps- Join a consultation with one tap---## 2. AI FirstAI should assist users throughout the application.Examples:- AI Search- AI Chat- AI Report Summary- AI Doctor Suggestions- AI Recommendations---## 3. TrustHealthcare requires confidence.The UI should communicate:- Security- Privacy- Professionalism- Transparency---## 4. AccessibilityThe application should support users with varying levels of digital literacy.Design considerations:- Large touch targets- Simple language- High contrast- Voice-friendly interactions- Screen reader compatibility---## 5. SpeedUsers should never wait unnecessarily.Target experience:- Fast loading- Smooth transitions- Minimal input- Responsive interactions---## 6. Human-CenteredTechnology should support people—not overwhelm them.The interface should feel:- Friendly- Calm- Helpful- Encouraging---# Design System---## Primary ColorMedical BlueRepresents:- Trust- Healthcare- Professionalism---## Secondary ColorGreenRepresents:- Health- Recovery- Success---## Accent ColorTeal / CyanUsed for:- AI Features- Interactive Cards- Highlights---## Error ColorRedUsed for:- Errors- Emergency- Critical Alerts---## WarningAmberUsed for:- Reminders- Pending Actions- Follow-ups---## Neutral ColorsWhiteLight GrayDark GrayBlack---# TypographyHeadings- Bold- Clear- High ContrastBody- Easy to read- Large enough for elderly usersButtons- High visibility- Large touch area---# IconographyUse clean healthcare icons.Examples:- Doctor- Hospital- Medicine- Calendar- Report- Heart- AI Spark- Video Call- SOS- Wallet---# SpacingGenerous spacing improves readability.Maintain:- Consistent padding- Large cards- Clear hierarchy- Minimal clutter---# Layout PrinciplesUse:- Card-based design- Rounded corners- Soft shadows- Minimal borders- Large CTA buttons---# Patient Application Architecture```Patient App│├── Authentication├── Dashboard├── AI Assistant├── Symptom Checker├── Doctors├── Appointments├── Video Consultation├── Medical Wallet├── OCR├── AI Report Analysis├── Health Timeline├── Laboratories├── Pharmacy├── Health Education├── Medicine Reminder├── Notifications├── Family Health├── Emergency SOS├── Profile└── Settings```---# Overall User Journey```Download App↓Create Account↓Complete Profile↓Home Dashboard↓AI Assistant↓Book Doctor↓Video Consultation↓Prescription↓Upload Reports↓Medical Wallet↓Medicine Reminder↓Healthy Lifestyle```---# Navigation PatternPrimary navigation uses a persistent **Bottom Navigation Bar**.```HomeAIAppointmentsMedical WalletProfile```Floating Action Button (FAB):- AI Chat- Emergency SOS (configurable)---# Navigation Principles- Maximum 5 bottom tabs- One-thumb usability- Consistent placement- Easy back navigation- Context-aware actions---# Authentication Module---# Authentication GoalsProvide a secure, frictionless onboarding experience.Objectives:- Fast registration- Secure login- Easy account recovery- Minimal user effort---# Authentication Flow```Splash↓Welcome↓Language Selection↓Login / Register↓OTP Verification↓Complete Profile↓Permissions↓Dashboard```---# Screen 1 — Splash Screen## PurposeIntroduce MedConnect AI while the application initializes.---### UI Components- App Logo- Animated Heart / Medical Pulse- Tagline- Loading Indicator---### Example Layout```LOGOMedConnect AIHealthcare Made SmarterLoading...```---### Behavior- Initialize app- Validate session- Load configuration- Navigate automatically---# Screen 2 — Welcome ScreenPurpose:Introduce key platform benefits.---### Hero SectionIllustration:Doctor + Patient + AI---HeadlineYour Intelligent Healthcare Companion---SubtitleConsult doctors, manage records, understand reports, and stay healthy—all in one place.---Primary CTAGet Started---Secondary CTASign In---# Screen 3 — Language SelectionSupported Languages- English- Hindi- MarathiFuture:- Tamil- Telugu- Kannada- Bengali- Gujarati---### LayoutLanguage Cards✓ EnglishHindiमराठी---ButtonsContinue---# Screen 4 — Login---## ComponentsEmail / Mobile NumberPasswordForgot PasswordLogin ButtonContinue with Google (Future)Continue with Apple (iOS Future)---AlternativeLogin using OTP---Example Layout```Welcome BackMobile NumberPasswordForgot Password?LoginORLogin with OTP```---# Validation- Required fields- Invalid credentials- Locked account messaging- Network error handling---# Screen 5 — Registration---Collect- Full Name- Mobile Number- Email (Optional)- Password- Confirm PasswordCheckboxes- Accept Terms- Privacy Policy ConsentButtonCreate Account---Validation- Strong password- Valid mobile number- Duplicate account detection---# Screen 6 — OTP VerificationPurposeVerify mobile number.---UIOTP InputCountdown TimerResend OTPVerify Button---Flow```Enter OTP↓Verify↓Success↓Complete Profile```---# Screen 7 — Complete ProfileCollect- Profile Photo (Optional)- Full Name- DOB- Gender- Blood Group- Height- Weight- Language- City- Emergency Contact---Optional Medical Details- Allergies- Chronic Diseases- Current MedicationsUsers can skip optional medical information and add it later.---# Screen 8 — PermissionsRequest permissions with clear explanations.Permissions:- Camera- Photos- Notifications- Microphone- LocationFuture:- Bluetooth (Wearables)- Health Connect / Apple Health (Platform dependent)Each permission should explain:- Why it is needed- What happens if denied- How it can be enabled later---# Authentication Success```Profile Completed↓Permissions Granted↓Dashboard↓AI Welcome Message```---# First-Time User ExperienceAfter onboarding:```Welcome Jay 👋I'm your AI Health Assistant.I can help you:✓ Understand symptoms✓ Book doctors✓ Explain reports✓ Manage medical records[Start Chat][Explore Dashboard]```---# Empty StatesExamples:### No AppointmentsYou haven't booked any appointments yet.**CTA:** Find a Doctor---### No ReportsUpload your first medical report to build your Medical Wallet.**CTA:** Upload Report---### No MedicinesNo active medicine reminders.**CTA:** Add Reminder---# Loading StatesUse skeleton loaders for:- Dashboard- Doctor Cards- Reports- Medical Wallet- Appointment Lists---# Error StatesExamples:### Internet LostYou're offline.Please check your internet connection.**Retry**---### Server ErrorSomething went wrong.Please try again.---### Authentication ErrorIncorrect mobile number or password.Try again or reset your password.---# Success StatesExamples:- Account Created- OTP Verified- Profile Updated- Login Successful- Report Uploaded- Appointment BookedUse subtle animations to reinforce successful actions.---# Security FeaturesThe authentication module should support:- JWT-based authentication- Secure token storage- Session timeout- Refresh tokens- Device management (future)- Biometric login (future)- Multi-factor authentication (future)---# Accessibility GuidelinesThe onboarding experience should:- Support screen readers- Offer high-contrast visuals- Provide large tap targets- Include clear error messages- Allow text scaling- Minimize typing where possible---# UX Principles- Registration in under 2 minutes- Minimal mandatory fields- Progressive profile completion- Friendly microcopy- Consistent button placement- AI-assisted onboarding- Smooth transitions- Mobile-first responsive layout---# Success Metrics| KPI | Target ||------|--------|| Registration Completion Rate | &gt;90% || OTP Success Rate | &gt;98% || Average Onboarding Time | &lt;2 minutes || Login Success Rate | &gt;98% || Permission Acceptance Rate | High with clear explanations || First-Day Activation | &gt;80% |---# Part 1 SummaryThis section defines the foundation of the MedConnect AI Patient Application.It includes:### Application Vision- AI-first healthcare companion- Simple, trustworthy, and accessible design- Mobile-first user experience### Design System- Healthcare-focused color palette- Card-based UI- Consistent typography and iconography- Accessibility-first principles### User Journey- End-to-end onboarding- Bottom navigation architecture- Guided first-time experience### Authentication Module- Splash and welcome screens- Language selection- Login and registration- OTP verification- Profile completion- Permission onboarding- Security and accessibility best practicesThis onboarding experience establishes user trust from the very first interaction and prepares patients to seamlessly access AI-powered healthcare services throughout the MedConnect AI platform.---# 12 - Patient Application (Part 2)# Dashboard, AI Health Assistant &amp; AI Symptom Checker---# OverviewAfter successful authentication, users enter the **Home Dashboard**, which serves as the central hub of the MedConnect AI ecosystem.The dashboard provides immediate access to healthcare services, AI-powered tools, appointments, medical records, reminders, and personalized health insights.The design philosophy emphasizes **clarity, personalization, and speed**, ensuring that users can accomplish common healthcare tasks with minimal effort.---# Dashboard ObjectivesThe Dashboard should enable users to:- View health information at a glance- Quickly access AI assistance- Book doctor appointments- Upload medical reports- Join upcoming consultations- Monitor medicines- Track health activities- Receive personalized recommendations---# Dashboard Information Architecture```Dashboard│├── Header├── AI Health Assistant Card├── Search Bar├── Quick Actions├── Upcoming Appointment├── Medicine Reminder├── Health Summary├── AI Recommendations├── Health Education├── Recent Medical Records├── Emergency SOS└── Bottom Navigation```---# Screen 1 — Home Dashboard## PurposeProvide users with a personalized healthcare overview.---# Dashboard Layout```------------------------------------------------☀ Good Morning, Jay 👋Stay Healthy!-----------------------------------------------🔍 Search doctors, medicines...-----------------------------------------------🤖 AI Health Assistant"How can I help you today?"[Start Chat]-----------------------------------------------Quick Actions👨‍⚕️ Doctor📅 Appointment📄 Upload Report💊 Medicines-----------------------------------------------Upcoming AppointmentTodayDr. Sharma10:30 AMJoin Now-----------------------------------------------Medicine ReminderParacetamol11:00 AMMark Taken-----------------------------------------------Health SummaryReportsAppointmentsMedicinesWallet-----------------------------------------------Recommended Articles-----------------------------------------------Nearby Doctors-----------------------------------------------Bottom NavigationHomeAIAppointmentsWalletProfile------------------------------------------------```---# HeaderDisplays- Greeting- User Name- Profile Photo- Notification IconExample```Good Morning,Jay 👋```Greeting changes dynamically.MorningAfternoonEveningNight---# Smart SearchUniversal search supports:- Doctors- Hospitals- Medicines- Diseases- Symptoms- Reports- ArticlesExample```Search...↓Fever↓DoctorArticlesMedicineSymptom Checker```---# AI Health Assistant CardLarge Hero CardDisplays```🤖Hello JayHow can I help you today?```Buttons- Start Chat- Voice Chat (Future)Suggested Prompts- I have fever- Explain my report- Book a doctor- Find nearby labs- Show medicines---# Quick ActionsLarge action cards.```DoctorAppointmentUpload ReportMedical WalletSymptom CheckerLaboratoryPharmacyEmergency SOS```All actions should be reachable within one tap.---# Health Summary CardDisplays```Appointments3----------------Reports18----------------Medicines4----------------Health Timeline```Selecting each card navigates to the corresponding module.---# Upcoming Appointment CardDisplaysDoctor NameSpecializationDateTimeHospital / OnlineButtonsJoinRescheduleCancelView Details---# Medicine Reminder CardDisplaysMedicine NameTimeDosageButtonsTakenSkipSnoozeExample```Paracetamol650mg11:00 AM[Taken][Snooze]```---# AI RecommendationsDynamic recommendations based on user profile.Examples```Your annual health checkup is due.Book Now-------------------Your HbA1c increased.Read Report-------------------Recommended CardiologistBook Appointment```---# Health Education CardDisplaysRecommended ArticlesExamples- Diabetes Prevention- Healthy Heart- Stress Management- Nutrition Guide---# Recent ReportsShows latest uploaded reports.Example```CBC ReportYesterdayView----------------Liver Function Test3 Days AgoOpen```---# Health Score (Future)Displays```Overall Health82 / 100Good```Future enhancement powered by AI analytics.---# Emergency SOS WidgetAlways visible.```🚨 Emergency?SOS```Should remain accessible from the dashboard at all times.---# PersonalizationDashboard adapts according to:- Age- Medical History- Chronic Diseases- Current Medicines- Recent Reports- Upcoming Appointments- Preferred LanguageNo two users should necessarily see identical dashboard content.---# Empty Dashboard StateFor new users.```Welcome to MedConnect AILet's begin your healthcare journey.Upload your first reportBook your first consultationStart AI Chat```---# Dashboard Loading StateUse skeleton placeholders.Load:- Cards- Reports- Doctor List- Recommendations---# Dashboard Error State```Unable to load dashboard.Retry```---# FEATURE — AI Health Assistant---# OverviewThe AI Health Assistant is the primary interaction interface within MedConnect AI.It provides conversational healthcare support while acting as an intelligent navigator across the platform.---# ObjectivesEnable users to:- Ask health questions- Understand reports- Find doctors- Book appointments- Learn about diseases- Navigate the application---# AI Chat ScreenLayout```HeaderAI Health Assistant------------------------Conversation------------------------Suggested Questions------------------------Input Box🎤Send```---# Welcome Screen```Hello Jay 👋I'm your AI Health Assistant.Ask me anything about your health.Examples• I have fever• Explain diabetes• Book dermatologist• Show my reports```---# Suggested QuestionsExamples- I have cough- Explain my blood report- Find nearby doctor- Show medicines- What is diabetes?- Book appointment- Healthy diet tips---# AI Conversation UIMessages should appear as chat bubbles.UserRightAILeftTimestampRead statusTyping animation---# Rich ResponsesAI responses may include:Doctor CardsAppointment CardsHealth ArticlesMedical ReportsButtonsQuick ActionsExample```Possible next stepBook DoctorUpload ReportRead Article```---# Voice Chat (Future)Support- Voice Input- Voice Output- Speech Recognition---# Multilingual ChatSupportedEnglishHindiMarathiUsers can switch language without leaving the conversation.---# AI CapabilitiesThe assistant supports:### Health EducationExplain diseases.---### Report ExplanationInterpret uploaded reports in simple language.---### Doctor NavigationHelp users locate appropriate specialists.---### Appointment AssistanceBookRescheduleCancel---### Medical Wallet SearchExample```Show my diabetes reports.```---### Medicine InformationExplain medicine usage and general precautions using reliable sources where applicable.The assistant should avoid prescribing treatments.---### Health ArticlesRecommend relevant educational content.---# Context AwarenessThe assistant understands context from:- Previous conversation- Uploaded reports- Appointments- Medical Wallet- User profile (with appropriate permissions)Example```UserShow my latest report.↓AIDisplays latest uploaded report.```---# AI SafetyThe assistant must:- Explain limitations- Avoid definitive diagnoses- Encourage consultation when needed- Detect emergencies---# Emergency DetectionExample```I have chest pain.↓Emergency Warning↓Emergency SOS↓Nearby Hospital↓Call Ambulance```---# AI FeedbackUsers can rate responses.👍 Helpful👎 Not HelpfulOptionalProvide feedback.---# Conversation HistoryStored securely.Search previous conversations.Delete conversation.Export conversation (Future).---# FEATURE — AI Symptom Checker---# OverviewThe AI Symptom Checker guides users through a structured symptom assessment to provide possible conditions, urgency guidance, and recommended next steps.The experience should feel like an intelligent medical questionnaire rather than a traditional form.---# ObjectivesHelp users:- Assess symptoms- Understand urgency- Connect with doctors- Receive educational information- Take appropriate next actions---# Symptom Checker Flow```Start↓Age↓Gender↓Primary Symptom↓Additional Symptoms↓Duration↓Severity↓Medical History↓AI Analysis↓Results```---# Screen 1 — Introduction```AI Symptom CheckerUnderstand your symptoms in a few minutes.This tool provides educational guidance and does not replace a healthcare professional.Start Assessment```---# Screen 2 — Primary SymptomQuestion"What is your main symptom?"Examples- Fever- Headache- Chest Pain- Cough- Vomiting- RashSearch supported.---# Screen 3 — Additional SymptomsMulti-select.Examples- Fatigue- Chills- Nausea- Cough- Body Pain- Breathing Difficulty---# Screen 4 — DurationOptions- Today- 2–3 Days- One Week- More than One Week---# Screen 5 — SeveritySlider```MildModerateSevere```---# Screen 6 — Medical HistorySelect- Diabetes- Hypertension- Asthma- Heart Disease- Pregnancy (where applicable)- None---# Screen 7 — ReviewDisplays all entered information.Edit option.Submit Assessment.---# AI Processing ScreenAnimation```Analyzing Symptoms...↓Checking Medical Patterns...↓Generating Recommendations...```---# Results ScreenDisplays```Possible Conditions1.Viral Fever82%------------------2.Influenza74%------------------3.COVID-1961%```Confidence scores represent the model's confidence and are **not** the probability of a confirmed diagnosis.---# Urgency LevelOne of:🟢 Low🟡 Medium🟠 High🔴 EmergencyEach level includes a clear explanation and recommended next steps.---# AI ExplanationExample```Based on your symptoms,viral fever appears to be one possible explanation.This is not a medical diagnosis.Please consult a qualified healthcare professional if symptoms worsen or persist.```---# Recommended ActionsButtonsBook DoctorRead Health ArticleUpload ReportStart AI ChatEmergency SOS (if applicable)---# Specialist RecommendationExample```RecommendedGeneral Physician```or```RecommendedCardiologist```---# Related Health ArticlesExamples- Fever Care- Influenza Prevention- When to Visit a Doctor---# Save AssessmentUsers can:SaveDeleteShare (Future)View History---# Previous AssessmentsDisplaysDateSymptomsResultDoctor Consulted---# Emergency ScreenIf emergency symptoms are detected.```Emergency Symptoms DetectedSeek immediate medical care.Call AmbulanceNearby HospitalsEmergency SOS```---# UX GuidelinesThe symptom checker should:- Ask one question at a time- Use conversational language- Minimize typing- Show progress indicators- Allow users to go back and edit responses- Clearly distinguish AI guidance from medical diagnosis- Provide immediate access to professional care when higher-risk symptoms are identified---# Performance Targets| KPI | Target ||------|--------|| Dashboard Load Time | &lt;2 seconds || AI Chat Response | &lt;3 seconds || Symptom Analysis | &lt;5 seconds || Search Response | &lt;1 second || Assessment Completion Rate | &gt;80% || User Satisfaction | &gt;4.5/5 |---# AccessibilityThe patient dashboard and AI modules should support:- Screen readers- High-contrast mode- Large touch targets- Dynamic text sizing- Keyboard navigation (Web)- Voice interaction (future)---# Part 2 SummaryThis section defines the core patient experience immediately after onboarding.It includes:### Dashboard- Personalized health overview- AI assistant entry point- Quick healthcare actions- Upcoming appointments- Medicine reminders- Health summaries- AI recommendations- Emergency access### AI Health Assistant- Conversational healthcare support- Report explanations- Doctor discovery- Appointment management- Context-aware assistance- Multilingual AI chat- Safety-first conversational design### AI Symptom Checker- Guided symptom assessment- AI-powered health insights- Urgency classification- Specialist recommendations- Educational guidance- Emergency detection and escalationTogether, these modules create the intelligent front door of the MedConnect AI Patient Application, providing users with personalized healthcare guidance, rapid access to services, and a seamless AI-powered experience from the moment they open the app.---# 12 - Patient Application (Part 3)# Doctor Search, Appointment Booking &amp; Video Consultation---# OverviewThe Doctor Consultation module is the core healthcare service within MedConnect AI, enabling users to discover qualified healthcare professionals, book appointments, conduct secure video consultations, and manage their healthcare journey from a single platform.Unlike traditional appointment booking applications, MedConnect AI uses artificial intelligence to help users find the right doctor based on symptoms, medical history, location, language preferences, availability, specialization, consultation mode, and previous healthcare interactions.The complete consultation experience should feel effortless—from finding a doctor to receiving a prescription after the consultation.---# ObjectivesThe Doctor Consultation module should enable users to:- Find the right doctor quickly- Book appointments in under one minute- Support Online &amp; Offline consultations- Join secure video consultations- Receive digital prescriptions- Manage appointment history- Receive appointment reminders- Rebook previous doctors- Share reports before consultation---# Module Architecture```Doctor Consultation│├── Doctor Search├── Doctor Details├── Appointment Booking├── Calendar├── Payment (Future)├── Appointment Confirmation├── Video Consultation├── Consultation Summary├── Prescription├── Follow-up Booking└── Appointment History```---# User Journey```Dashboard↓Search Doctor↓Doctor Profile↓Book Appointment↓Choose Date &amp; Time↓Confirm Booking↓Appointment Reminder↓Join Video Call↓Consultation↓Prescription↓Medical Wallet↓Follow-up```---# FEATURE — Doctor Search---# OverviewDoctor Search helps users discover the most suitable healthcare professional using filters, AI recommendations, and intelligent search capabilities.---# Search Entry PointsUsers can access doctor search from:- Dashboard- AI Assistant- Symptom Checker- Search Bar- Health Report Recommendations- Appointment History- Home Quick Action---# Screen — Doctor Search---## Layout```------------------------------------------------🔍 Search Doctors--------------------------------------------Search Bar--------------------------------------------CategoriesGeneral PhysicianDentistCardiologistDermatologistNeurologistPediatrician--------------------------------------------Recommended Doctors--------------------------------------------Nearby Doctors--------------------------------------------Popular Doctors------------------------------------------------```---# Search BarSupports searching by:- Doctor Name- Specialty- Hospital- Clinic- Disease- SymptomsExample```Search↓Heart↓Cardiologist```---# Specialty CategoriesDisplay large icon cards.Examples- General Physician- Cardiologist- Dermatologist- Orthopedic- Neurologist- ENT- Gynecologist- Psychiatrist- Pediatrician- Ophthalmologist- Urologist- Gastroenterologist- Pulmonologist- Oncologist- Nephrologist---# AI Recommended DoctorsRecommendations are based on:- Symptoms- Medical history- Previous consultations- Preferred language- Distance- Ratings- AvailabilityExample```RecommendedDr. Rahul SharmaCardiologist★★★★☆Available Today```---# FiltersUsers can filter by:- Specialty- Consultation Mode- Experience- Rating- Language- Gender- Consultation Fee- Availability- Hospital- Distance---# Sort OptionsSort by:- Relevance- Nearest- Highest Rated- Most Experienced- Lowest Fee- Earliest Available---# Doctor CardEach doctor card displays:```PhotoDoctor NameQualificationSpecializationExperienceLanguagesHospitalRatingConsultation FeeNext Available SlotBook Appointment```---# Doctor Profile Screen---## OverviewDisplays complete professional information.---# Sections### Doctor Information- Photo- Name- Qualification- Registration Number- Specialization- Years of Experience---### About DoctorProfessional biography.---### Areas of ExpertiseExamples- Diabetes- Heart Disease- Blood Pressure- Thyroid Disorders---### LanguagesExamples- English- Hindi- Marathi---### Consultation Types- Video Consultation- Clinic Visit---### Consultation FeeOnlineOffline---### Clinic Information- Address- Working Hours- Contact- Map Location---### ReviewsDisplays:- Average Rating- Total Reviews- Patient Feedback---### Available SlotsToday's scheduleTomorrowNext Week---### CTABook Appointment---# FEATURE — Appointment Booking---# Booking Flow```Doctor↓Select Consultation Mode↓Select Date↓Select Time↓Upload Reports (Optional)↓Confirm↓Payment (Future)↓Appointment Confirmed```---# Consultation Modes- Video Consultation- Clinic VisitFuture:- Home Visit- Audio Consultation---# Screen — Select DateCalendar View```August121314151617```Unavailable dates are disabled.---# Screen — Select Time Slot```Morning09:0009:3010:0011:00------------------Afternoon02:0002:3003:00------------------Evening06:0006:30```Unavailable slots are disabled.---# Upload Medical ReportsOptional.Users can attach:- Blood Reports- Prescriptions- MRI- CT Scan- X-Ray- Previous ReportsAI automatically suggests relevant reports from the Medical Wallet.---# Appointment Review ScreenDisplays```DoctorDateTimeModeConsultation FeeReports AttachedConfirm Appointment```---# Appointment ConfirmationAnimation```✓Appointment Booked Successfully```Shows- Doctor- Date- Time- Consultation Mode- Meeting Link (Online)- Calendar IntegrationButtons- Add to Calendar- View Appointment- Share- Return Home---# Appointment Details ScreenDisplays- Doctor- Date- Time- Status- Consultation Type- Reports- Prescription (after consultation)- NotesButtons- Join Call- Reschedule- Cancel---# Appointment StatusPossible statuses:- Upcoming- Confirmed- In Progress- Completed- Cancelled- Missed---# Appointment Timeline```Booked↓Confirmed↓Reminder↓Consultation↓Prescription↓Completed↓Follow-up```---# Appointment RemindersNotifications- One Day Before- One Hour Before- Fifteen Minutes Before- At Consultation Time---# Reschedule Flow```Appointment↓Reschedule↓New Date↓New Time↓Confirmation```---# Cancellation FlowUser selects reason.Examples- Schedule Conflict- Feeling Better- Emergency- OtherCancellation policies should be clearly displayed.---# Appointment HistoryDisplays- Date- Doctor- Consultation Type- Status- Prescription- ReportsQuick actions- Rebook- Download Prescription- View Summary---# FEATURE — Video Consultation---# OverviewSecure video consultations enable patients and doctors to connect remotely for healthcare consultations.The experience should require only one tap to join.---# TechnologyRecommended:- Twilio Video- Daily.co- LiveKit- Agora(Platform implementation can choose based on scalability and pricing.)---# Video Consultation Flow```Reminder↓Join Meeting↓Permission Check↓Waiting Room↓Doctor Joins↓Consultation↓Prescription↓Feedback```---# Screen — Join Consultation```Video ConsultationDr. Rahul SharmaStarts In10 MinutesJoin Now```---# Permission ScreenRequest- Camera- MicrophoneAllow users to test devices before joining.---# Waiting RoomDisplays- Doctor Name- Appointment Time- Connection StatusAnimation```Waiting for Doctor...```---# Video Call Interface```Doctor Video-----------------------Patient Video-----------------------MuteCameraSpeakerChatShare ReportEnd Call```---# In-call FeaturesSupported features:- HD Video- Audio- Mute- Camera Toggle- Screen Sharing (Future)- In-call Chat- File Sharing- Network Indicator- Call Duration- Full Screen---# Share Medical ReportsDuring consultation users can instantly share reports from the Medical Wallet.```Medical Wallet↓Select Report↓Share with Doctor```---# AI Features During Consultation (Future)- Live AI Notes- Real-time Transcript- AI Consultation Summary- Medical Keyword Detection- Follow-up Suggestions- Action Item ExtractionAI-generated notes should always be reviewable by the clinician before being finalized.---# Connection RecoveryIf internet disconnects:```Connection Lost↓Reconnecting...↓Reconnect Successful```If reconnection fails:- Retry- Audio Only- Rejoin Call---# End ConsultationConfirmation```End Consultation?YesNo```---# Consultation CompleteDisplays```Consultation CompletedPrescription ReadyConsultation Summary AvailableBook Follow-up```---# Digital PrescriptionDoctor uploads prescription.Patient can:- View- Download PDF- Save to Medical Wallet- Share---# Consultation SummaryDisplays:- Chief Complaint- Doctor Notes- Diagnosis (if provided by doctor)- Prescribed Medicines- Recommended Tests- Follow-up DateThe summary should clearly distinguish clinician-entered notes from AI-generated summaries.---# Feedback ScreenPatient rates:★★★★★Feedback categories:- Doctor- Video Quality- Waiting Time- Overall Experience---# Empty States### No Doctors FoundTry changing your filters or search keywords.**CTA:** Reset Filters---### No AppointmentsYou don't have any upcoming appointments.**CTA:** Book a Doctor---### No Consultation HistoryYour completed consultations will appear here.---# Error StatesExamples### No InternetUnable to connect.Retry---### Slot UnavailableThis time slot has already been booked.Please choose another slot.---### Video ErrorUnable to connect to the consultation.Retry---# Loading StatesSkeleton loaders for:- Doctor Cards- Reviews- Time Slots- Calendar- Appointment DetailsLoading animation for:- Joining Meeting- Connecting Video- Uploading Reports---# Accessibility GuidelinesThe consultation experience should support:- Screen reader compatibility- Large touch targets- Live captions (future)- Keyboard navigation (Web)- Adjustable font sizes- High-contrast mode---# Security &amp; PrivacyThe consultation module should provide:- End-to-end encrypted signaling where supported by the chosen provider- Secure authenticated meeting access- Role-based access (Doctor/Patient)- Protected report sharing- Secure prescription delivery- Audit logging- Consent for recording (if recording is introduced in the future)---# Success Metrics| KPI | Target ||------|--------|| Doctor Search Response | &lt;1 second || Appointment Booking Time | &lt;60 seconds || Booking Success Rate | &gt;95% || Video Join Success | &gt;98% || Average Join Time | &lt;10 seconds || Consultation Completion Rate | &gt;95% || User Satisfaction | &gt;4.5/5 |---# Part 3 SummaryThis section defines the complete digital consultation workflow within the MedConnect AI Patient Application.### Doctor Search- Intelligent doctor discovery- AI-powered recommendations- Advanced filtering and sorting- Comprehensive doctor profiles### Appointment Booking- Fast booking flow- Online and offline consultation options- Calendar and slot management- Report attachment- Appointment lifecycle management### Video Consultation- Secure one-tap video consultations- In-call report sharing- Digital prescriptions- Consultation summaries- Feedback and follow-up booking- Future AI-powered consultation assistanceTogether, these modules provide a seamless end-to-end consultation experience—from discovering the right doctor to completing a virtual visit and securely storing the consultation outcome within the MedConnect AI ecosystem.---# 12 - Patient Application (Part 4)# Medical Wallet, OCR, AI Report Analysis &amp; Health Timeline---# OverviewThe **Medical Wallet** is one of the flagship features and unique selling propositions (USP) of MedConnect AI. It serves as a secure digital health vault where patients can store, organize, access, analyze, and share all their medical records from a single platform.Unlike a traditional document storage system, the Medical Wallet leverages **Artificial Intelligence, OCR, and Medical Report Analysis** to transform static reports into searchable, structured, and meaningful healthcare insights.The Medical Wallet becomes the patient's lifelong digital healthcare record, accessible anytime and anywhere.---# ObjectivesThe Medical Wallet should enable users to:- Store all medical records securely- Organize documents automatically- Extract medical data using OCR- Understand reports through AI- Track health trends over time- Share reports securely with doctors- Search documents instantly- Build a complete digital health history---# Module Architecture```Medical Wallet│├── Dashboard├── Upload Report├── OCR Processing├── AI Report Analysis├── Medical Reports├── Prescriptions├── Lab Reports├── Imaging Reports├── Vaccination Records├── Health Timeline├── Document Search├── Report Sharing└── Export Records```---# User Journey```Dashboard↓Upload Report↓OCR Processing↓AI Analysis↓Medical Wallet↓Health Timeline↓Doctor Consultation↓Share Reports↓Long-Term Medical History```---# FEATURE — Medical Wallet Dashboard---## PurposeProvide a centralized view of all health records.---## Dashboard Layout```------------------------------------------------Medical Wallet--------------------------------------------Total Documents48--------------------------------------------CategoriesLab ReportsPrescriptionsRadiologyVaccinationsDischarge SummaryCertificates--------------------------------------------Recent Uploads--------------------------------------------Health Timeline--------------------------------------------Search Reports------------------------------------------------```---# Wallet Summary CardDisplays- Total Reports- Total Prescriptions- AI Analyses Completed- Last Upload Date- Storage Used---# CategoriesLarge icon cards.Examples📄 Lab Reports💊 Prescriptions🩻 Radiology💉 Vaccinations🏥 Hospital Records📋 Medical Certificates🧬 Health Assessments---# Recent ReportsDisplays```CBC ReportYesterdayAI Summary Available----------------Prescription3 Days AgoView----------------MRI ScanLast Week```---# Quick Actions```Upload ReportScan DocumentSearch RecordsShare ReportsAI Analysis```---# FEATURE — Upload Medical Report---## Upload SourcesUsers can upload reports from:- Camera- Gallery- PDF- Files- Cloud Storage (Future)---# Upload Flow```Select File↓Preview↓Upload↓OCR↓AI Analysis↓Medical Wallet```---# Upload ScreenDisplays```Upload Medical ReportChoose Source📷 Camera🖼 Gallery📄 PDF📁 Files```---# Supported FormatsImages- JPG- JPEG- PNG- HEIC (Future)Documents- PDF- Multi-page PDF---# Upload Progress```Uploading...██████████82%```---# Upload Success```✓Report Uploaded SuccessfullyStarting AI Analysis...```---# FEATURE — OCR Processing---## OverviewOnce uploaded, every document is processed using an intelligent OCR pipeline.---# OCR Processing Flow```Upload↓Image Enhancement↓Text Extraction↓Medical Entity Detection↓Data Structuring↓Confidence Validation↓Medical Wallet```---# OCR Loading Screen```Reading Report...Extracting Text...Recognizing Medical Values...Almost Done...```---# Extracted InformationThe OCR engine identifies:### Patient Information- Name- Age- Gender---### Hospital- Hospital Name- Doctor Name- Department---### Report Information- Report Type- Date- Test Category---### Laboratory ParametersExamples- Hemoglobin- WBC- Platelets- Blood Sugar- HbA1c- Cholesterol- Vitamin D---### Prescription- Medicine Name- Dosage- Frequency- Duration---# OCR VerificationIf confidence is low:```AI isn't fully confident.Please verify highlighted values.```Users can edit extracted fields before saving.---# FEATURE — AI Report Analysis---# OverviewThe AI Report Analysis module explains medical reports in simple language, helping users understand complex medical terminology without replacing professional medical advice.---# Analysis Workflow```Medical Report↓OCR↓Structured Data↓Medical AI↓Summary↓Recommendations↓Medical Wallet```---# Report Summary ScreenDisplays```Overall Report StatusNormal------------------Key Findings------------------Abnormal Results------------------Recommendations------------------Next Steps```---# AI Summary CardExample&gt; Your Complete Blood Count is mostly within the normal range. Hemoglobin levels are normal, while Vitamin D appears lower than the reference range. Consider discussing these findings with your healthcare provider.---# Parameter AnalysisEach parameter displays:| Test | Result | Status ||-------|--------|--------|| Hemoglobin | 13.8 | ✅ Normal || Vitamin D | 18 | ⚠ Low || HbA1c | 6.5 | ⚠ Elevated |Selecting a parameter opens a detailed explanation.---# Detailed ExplanationExample```Vitamin DResult18 ng/mLReference Range30–100 ng/mLAI ExplanationVitamin D supports bone health and immune function. Your result is below the reference range. Discuss this finding with your healthcare provider to determine whether further evaluation or treatment is appropriate.```---# Abnormal FindingsHighlight using color indicators.🟢 Normal🟡 Borderline🟠 High🔴 CriticalCritical findings should encourage users to seek prompt medical attention without making definitive diagnoses.---# AI RecommendationsExamples- Consult General Physician- Repeat Test- Upload Previous Report- Book Specialist- Read Health Education---# Trend ComparisonIf previous reports exist:```HbA1c20256.1↓20266.4↓20266.8Increasing Trend```---# Download AI SummaryUsers can:- Save PDF- Share Summary- Export Analysis---# FEATURE — Medical Reports---# Report ListDisplays all uploaded reports.```CBC ReportYesterdayAI Summary------------------Liver FunctionLast Week------------------MRIJuly 18```---# Filters- Date- Category- Hospital- Doctor- Report Type---# SearchSupports searching by:- Report Name- Hospital- Test- Medicine- Doctor---# Report Detail ScreenDisplays- Report Preview- AI Summary- OCR Data- Download- Share- Delete- View Timeline---# FEATURE — PrescriptionsDisplays:- Doctor- Medicines- Dosage- Date- AI Explanation- Download---# FEATURE — RadiologySupports- MRI- CT- X-Ray- Ultrasound- PET ScanDisplays- Report- Images (where available)- AI Summary- Doctor NotesFuture versions may support AI-assisted imaging insights subject to clinical validation.---# FEATURE — Vaccination RecordsDisplays```COVID-19Completed----------------Tetanus2024----------------InfluenzaDue```Upcoming vaccinations generate reminder suggestions.---# FEATURE — Health Timeline---# OverviewThe Health Timeline provides a chronological view of the patient's healthcare journey.---# Timeline Flow```Appointment↓Prescription↓Report↓Medicine↓Vaccination↓Follow-up```---# Timeline Screen```2026↓Doctor Consultation↓Blood Report↓Medicine Started↓Follow-up↓Recovered```---# Timeline EventsIncludes- Doctor Visits- Reports- Medicines- Vaccinations- Surgeries- Hospital Admissions- Emergency Visits- Health Assessments---# Event DetailDisplays- Event Date- Doctor- Documents- Notes- Attachments- AI Summary---# Timeline FiltersUsers can filter by:- Year- Doctor- Hospital- Condition- Report Type---# Timeline InsightsAI highlights:- Recurring tests- Long-term trends- Missed follow-ups- Medication history- Health milestones---# FEATURE — Report Sharing---# Sharing OptionsUsers can share:- Individual Report- Multiple Reports- Entire Medical Wallet- AI Summary---# Share Methods- Secure Link- PDF- QR Code- Email- Doctor PortalSecure links should be time-limited and protected with user authorization.---# Access ControlUsers control:- Who can view- Expiration Date- Download Permission- Revoke Access---# FEATURE — Search Medical RecordsUniversal search supports:- Disease- Test- Doctor- Medicine- Hospital- Report Type- DateExample```Search↓Diabetes↓All Diabetes Reports```---# Empty States### No ReportsYou haven't uploaded any reports yet.**CTA:** Upload Your First Report---### No PrescriptionsYour prescriptions will appear here after consultations.---### No TimelineStart building your digital health history by uploading reports or booking appointments.---# Loading StatesSkeleton loaders for:- Report Cards- Timeline- AI Summary- OCR Results---# Error States### OCR FailedWe couldn't read this document clearly.Try uploading a higher-quality image.---### AI Analysis UnavailableThe report has been uploaded successfully, but AI analysis couldn't be completed right now.Retry Analysis---### Upload FailedUpload unsuccessful.Retry---# AccessibilityThe Medical Wallet should support:- Screen readers- High-contrast mode- Zoomable report viewer- Large touch targets- Accessible PDFs where possible---# Security &amp; PrivacyThe Medical Wallet should include:- End-to-end encrypted file transfer- Encryption at rest- Role-based access control- Secure cloud storage- Audit logs- User-controlled sharing permissions- Consent-based access- Secure deletion- Backup and disaster recoveryFuture enhancement:- Blockchain-backed document integrity verification for tamper-evident medical records.---# Success Metrics| KPI | Target ||------|--------|| Upload Success Rate | &gt;98% || OCR Processing Time | &lt;10 seconds || AI Analysis Time | &lt;5 seconds || OCR Accuracy | High || Report Search Response | &lt;1 second || Timeline Load Time | &lt;2 seconds || User Satisfaction | &gt;4.5/5 |---# UX GuidelinesThe Medical Wallet should feel like a modern digital health vault.Design Principles:- One-tap upload- Automatic organization- Minimal manual input- AI-first experience- Fast search- Clear medical explanations- Secure sharing- Lifelong health record management- Consistent card-based interface- Mobile-first usability---# Part 4 SummaryThis section defines the digital health record experience within the MedConnect AI Patient Application.### Medical Wallet- Secure cloud-based health record storage- Organized document categories- Fast search and retrieval- Secure report sharing### OCR Engine- Automatic medical document digitization- Intelligent entity extraction- Structured healthcare data generation- Confidence validation and user verification### AI Report Analysis- Plain-language explanations of medical reports- Test-by-test analysis- Abnormal value highlighting- AI-powered recommendations- Longitudinal trend comparisons### Health Timeline- Chronological healthcare history- Reports, prescriptions, appointments, vaccinations, and medications- AI-generated health insights- Searchable and filterable patient journeyTogether, these modules transform MedConnect AI from a healthcare application into a comprehensive digital health record platform, enabling patients to securely manage, understand, and share their lifelong medical history while benefiting from AI-powered healthcare insights.---# 12 - Patient Application (Part 5)# Laboratory Comparison, Pharmacy Finder, Health Education, Medicine Reminder &amp; Notifications---# OverviewThis section covers the daily healthcare utility features of MedConnect AI. These modules help patients beyond doctor consultations by enabling them to compare laboratory services, locate nearby pharmacies, learn about health conditions, manage medication schedules, and receive personalized healthcare notifications.These features encourage **preventive healthcare**, improve treatment adherence, and enhance the overall patient experience.---# Module Architecture```Healthcare Services│├── Laboratory Comparison├── Diagnostic Test Booking├── Pharmacy Finder├── Medicine Search├── Health Education├── Health Library├── Medicine Reminder├── Smart Notifications└── Notification Center```---# User Journey```Doctor Consultation↓Prescription↓Book Laboratory Test↓Upload Reports↓AI Analysis↓Medicine Reminder↓Health Education↓Healthy Lifestyle```---# FEATURE — Laboratory Comparison---# OverviewThe Laboratory Comparison module enables users to compare diagnostic laboratories, test prices, turnaround times, accreditation, ratings, and available home collection services.Instead of booking blindly, users can make informed decisions based on cost, quality, convenience, and location.---# ObjectivesUsers should be able to:- Search diagnostic tests- Compare laboratory prices- Find NABL-accredited laboratories- View ratings and reviews- Book laboratory tests- Request home sample collection- Access test reports through the Medical Wallet---# Laboratory Dashboard```------------------------------------------------Diagnostic Laboratories--------------------------------------------Search Tests--------------------------------------------Popular TestsCBCHbA1cThyroidLipid ProfileVitamin D--------------------------------------------Nearby Laboratories--------------------------------------------Offers--------------------------------------------Recommended Tests------------------------------------------------```---# Search Laboratory TestUsers can search by:- Test Name- Package Name- Laboratory Name- Health Checkup PackageExample```Search↓Blood Sugar↓Available Labs```---# Test Comparison ScreenDisplays| Laboratory | Price | Home Collection | Rating | Result Time ||------------|-------|----------------|--------|-------------|| Lab A | ₹350 | ✅ | ★4.8 | 6 Hours || Lab B | ₹420 | ✅ | ★4.7 | 8 Hours || Lab C | ₹290 | ❌ | ★4.3 | 24 Hours |---# Laboratory CardEach card includes:- Laboratory Name- Accreditation- Rating- Distance- Test Price- Home Collection Availability- Report Delivery Time- Open/Closed StatusButtons- View Details- Book Test---# Laboratory DetailsDisplays- Laboratory Information- Accreditation- Address- Working Hours- Contact- Available Tests- Packages- Reviews- Photos- Map---# Book Laboratory TestFlow```Select Test↓Select Laboratory↓Select Date↓Select Time↓Home Collection (Optional)↓Confirm Booking```---# Booking ConfirmationDisplays- Booking ID- Test Name- Laboratory- Date- Time- Home Collection DetailsButtons- Add to Calendar- View Booking---# Laboratory ReportsCompleted laboratory reports are automatically added to the Medical Wallet after successful processing.---# FEATURE — Pharmacy Finder---# OverviewThe Pharmacy Finder helps users locate nearby pharmacies and discover medicine availability.Future integrations may support medicine inventory and online ordering where partnerships exist.---# ObjectivesUsers should be able to:- Search medicines- Locate pharmacies- Compare pharmacy details- Navigate using maps- Contact pharmacies- Save favorite pharmacies---# Pharmacy Dashboard```------------------------------------------------Nearby Pharmacies--------------------------------------------Search Medicines--------------------------------------------Open Pharmacies--------------------------------------------24x7 Pharmacies--------------------------------------------Recent Searches------------------------------------------------```---# SearchSupports:- Medicine Name- Generic Name- Pharmacy Name---# Pharmacy CardDisplays- Pharmacy Name- Rating- Distance- Open Status- Working Hours- Contact NumberButtons- Directions- Call- View Details---# Pharmacy DetailsDisplays- Address- Working Hours- Contact- Reviews- Available Services- Map- Nearby Landmarks---# Medicine SearchExample```Search↓Paracetamol↓Nearby Pharmacies```Future:- Alternative generic medicines- Medicine availability- Price comparison- Online ordering---# FEATURE — Health Education---# OverviewThe Health Education module empowers patients with reliable, easy-to-understand medical knowledge to encourage preventive healthcare and improve health literacy.AI recommends personalized educational content based on the patient's age, health conditions, reports, consultations, and interests.---# ObjectivesUsers should be able to:- Learn about diseases- Understand treatments- Read preventive care articles- Watch educational videos- Explore wellness guides- Improve healthcare awareness---# Health Education Dashboard```------------------------------------------------Health Education--------------------------------------------Recommended For You--------------------------------------------CategoriesHeart HealthDiabetesNutritionMental HealthWomen's HealthFirst Aid--------------------------------------------Featured Articles--------------------------------------------Videos------------------------------------------------```---# CategoriesExamples- General Health- Heart Health- Diabetes- Hypertension- Nutrition- Women's Health- Men's Health- Child Health- Mental Health- Pregnancy- Senior Care- First Aid- Lifestyle- Exercise- Preventive Care---# Article CardDisplays- Title- Reading Time- Category- Difficulty Level- AI Recommended Badge---# Article ScreenDisplays- Cover Image- Title- Author- Last Updated- Reading Time- Article Content- Related ArticlesButtons- Save- Share- Listen (Future)---# Video Library (Future)Displays- Health Awareness Videos- Exercise Tutorials- CPR Demonstrations- Nutrition Guides- Yoga Sessions- Mental Wellness Videos---# AI RecommendationsExamples```Based on your recent HbA1c report,you may benefit from reading:Managing Type 2 Diabetes```---# FEATURE — Medicine Reminder---# OverviewMedicine Reminder helps patients follow prescribed medication schedules and improve treatment adherence.---# ObjectivesUsers should be able to:- Add medicines- Set reminders- Track adherence- Mark doses as taken- View medication history---# Reminder Dashboard```------------------------------------------------Today's Medicines--------------------------------------------11:00 AMParacetamol650mg--------------------------------------------2:00 PMVitamin D--------------------------------------------8:00 PMMetformin------------------------------------------------```---# Add MedicineUsers enter:- Medicine Name- Dosage- Frequency- Start Date- End Date- Meal Instructions- Reminder TimeFuture:- Scan prescription using AI- Auto-import from doctor's prescription---# Reminder NotificationExample```💊Time to takeParacetamol650mg[Taken][Snooze][Skip]```---# Reminder StatusUsers can mark:- Taken- Skipped- Snoozed- Missed---# Medicine HistoryDisplays- Medicine- Date- Time- Status---# Adherence DashboardShows:- Daily Adherence- Weekly Adherence- Monthly Adherence- Missed Doses- Overall Compliance %Future AI can generate adherence insights and gentle encouragement based on user behavior.---# Refill Reminder (Future)AI reminds users when medicine may be running low based on prescription duration and adherence history.---# FEATURE — Notifications---# OverviewThe Notification Center serves as the communication hub for all healthcare events and AI recommendations.Notifications should be timely, relevant, and actionable without overwhelming the user.---# Notification Categories- Appointments- Medicines- Reports- AI Recommendations- Health Tips- Laboratory Updates- Emergency Alerts- Promotional (Optional)- System NotificationsUsers should be able to customize notification preferences.---# Notification Center```------------------------------------------------Notifications--------------------------------------------TodayAppointment ReminderMedicine ReminderNew AI Report Analysis--------------------------------------------YesterdayHealth ArticleLab Report Ready------------------------------------------------```---# Notification CardDisplays- Icon- Title- Description- Timestamp- Read StatusButtons (contextual)- View- Book- Dismiss---# Smart NotificationsExamples```Your appointment starts in 30 minutes.Join Now``````Your laboratory report is ready.View Report``````Time to take Vitamin D.Mark as Taken``````New AI report analysis is available.View Summary``````Your annual health check-up is due.Book Appointment```---# AI-Powered NotificationsExamples- Follow-up reminder after consultation- Vaccination due reminder- Health screening recommendation- Missed medicine alert- Health education recommendation- Chronic disease monitoring remindersNotifications should be explainable and based on available user data with appropriate consent.---# Notification PreferencesUsers can enable or disable:- Appointment Notifications- Medicine Reminders- Laboratory Updates- AI Recommendations- Health Tips- Promotional Notifications---# Notification SettingsOptions- Push Notifications- Email Notifications- SMS Notifications (Future)- WhatsApp Notifications (Future)---# Empty States### No Laboratory BookingsYou haven't booked any laboratory tests.**CTA:** Find Laboratories---### No Saved ArticlesYour saved health articles will appear here.---### No MedicinesYou don't have any active medicine reminders.**CTA:** Add Medicine---### No NotificationsYou're all caught up.No new notifications.---# Loading StatesUse skeleton loaders for:- Laboratory cards- Pharmacy cards- Articles- Notifications- Medicine reminders---# Error States### Laboratory Booking FailedUnable to complete your booking.Please try again.---### Pharmacy Search FailedUnable to retrieve nearby pharmacies.Retry---### Notification ErrorUnable to load notifications.Refresh---# AccessibilityThese modules should support:- Screen readers- Large text- High-contrast mode- Voice-friendly controls- Large action buttons---# Security &amp; PrivacyHealthcare notifications should:- Avoid exposing sensitive medical information on the lock screen by default- Respect user notification preferences- Use encrypted communication where applicable- Allow users to manage notification permissions- Protect shared health information---# Success Metrics| KPI | Target ||------|--------|| Laboratory Booking Success | &gt;95% || Pharmacy Search Response | &lt;2 seconds || Article Engagement Rate | &gt;40% || Medicine Reminder Adherence | &gt;80% || Notification Open Rate | &gt;60% || User Satisfaction | &gt;4.5/5 |---# UX GuidelinesThese healthcare utility modules should emphasize:- Simplicity- Preventive healthcare- Personalized recommendations- AI-assisted guidance- Minimal user effort- Fast navigation- Actionable notifications- Consistent card-based design- Mobile-first experience---# Part 5 SummaryThis section defines the everyday healthcare support services within the MedConnect AI Patient Application.### Laboratory Comparison- Diagnostic test search- Laboratory comparison- Home sample collection- Online booking- Automatic report integration### Pharmacy Finder- Nearby pharmacy discovery- Medicine search- Directions and contact information- Future medicine availability integration### Health Education- Personalized health articles- Preventive healthcare content- AI-powered recommendations- Future educational video library### Medicine Reminder- Medication scheduling- Smart reminders- Adherence tracking- Prescription integration- Future refill intelligence### Notifications- Centralized healthcare communication- Appointment and medicine reminders- AI-generated health recommendations- Personalized notification preferencesTogether, these modules extend MedConnect AI beyond consultations by helping patients manage everyday healthcare activities, improve medication adherence, increase health awareness, and stay proactively engaged in their long-term wellness journey.---# 12 - Patient Application (Part 6)# Emergency SOS + Family Health + Profile + Settings + Remaining Screens + Complete Screen Matrix# 1. OverviewThis section defines the remaining screens and supporting modules of the MedConnect AI Patient Application.The modules covered are:Emergency SOSEmergency ContactsFamily HealthPatient ProfileAccount SettingsPrivacy &amp; SecurityLanguage SettingsNotification SettingsHelp &amp; SupportAboutLegal &amp; ConsentFeedbackRemaining utility screensGlobal statesComplete Patient Application Screen MatrixThese features complete the patient-side application and ensure that MedConnect AI is not limited to doctor consultations but acts as a complete digital healthcare companion.# 2. Emergency SOS## 2.1 OverviewThe Emergency SOS feature provides patients with a fast-access emergency interface for situations requiring urgent assistance.The primary design principle is:In an emergency, minimize the number of actions required from the user.The emergency experience should be visually distinct from normal healthcare workflows.# 2.2 Emergency Entry PointsSOS can be accessed from:Patient DashboardBottom NavigationGlobal emergency buttonProfileLock-screen/device integration — futureVoice activation — futureThe SOS button should remain easily discoverable without accidentally triggering an emergency.# 2.3 Emergency SOS Screen-----------------------------------

        EMERGENCY SOS

Are you in an emergency?

      [ ACTIVATE SOS ]

-----------------------------------

Quick Emergency Actions

🚑 Find Ambulance

🏥 Find Nearby Hospital

📞 Call Emergency Services

👨‍👩‍👧 Notify Emergency Contact

-----------------------------------
# 2.4 SOS ActivationBecause SOS is a high-impact action, activation should include a very short confirmation mechanism unless the platform/device integration provides an intentional emergency trigger.Example:Activate Emergency SOS?

This may:
• Share your emergency location
• Notify selected emergency contacts
• Help you find nearby emergency services

[Activate SOS]

[Cancel]
# 2.5 Active SOS ScreenAfter activation:-----------------------------------

        SOS ACTIVE

Emergency assistance activated.

Location:
Sharing...

-----------------------------------

🚑 Find Ambulance

🏥 Nearby Hospitals

📞 Emergency Call

👨‍👩‍👧 Contacts Notified

-----------------------------------

[Cancel SOS]
# 2.6 Emergency LocationWhere permitted by the user and device:Current locationGPS coordinatesNearby hospitalsNearby pharmaciesNearby ambulance servicesLocation sharing must require appropriate permission and clearly communicate what is being shared.# 2.7 Emergency ContactsUsers can configure trusted contacts.Fields:NameRelationshipPhone NumberPriorityNotification PermissionExample:Emergency Contacts

1. Father
   +91 XXXXX XXXXX

2. Mother
   +91 XXXXX XXXXX

3. Spouse
   +91 XXXXX XXXXX

[+ Add Contact]
# 2.8 Emergency Contact NotificationExample:Emergency Alert

Jay may require emergency assistance.

Location:
[Secure Location Link]

Time:
4:35 PM

Please contact them immediately.
Sensitive health information should not be unnecessarily included in emergency notifications.# 2.9 Emergency ServicesDepending on deployment and available integrations, the application can provide:Emergency service callAmbulance discoveryNearby hospitalsNavigationEmergency contact notificationThe application should clearly distinguish between MedConnect AI services and external emergency services.# 2.10 Nearby HospitalsDisplays:Hospital NameDistanceEmergency availability where knownAddressPhoneDirectionsActions:CallDirectionsView Details# 2.11 Emergency Medical InformationOptional emergency profile information:Blood GroupAllergiesCritical medical conditionsCurrent medicationsEmergency contactsUsers should explicitly control which information is available for emergency use.# 2.12 Emergency QR CardFuture feature:A patient can generate an emergency QR code.Scanning can display a minimal emergency profile, subject to privacy controls.Example:Emergency Medical Card

Name
Blood Group
Critical Allergies
Emergency Contacts

[Emergency Information]
No unnecessary medical history should be publicly exposed.# 3. Family Health# 3.1 OverviewFamily Health allows users to manage healthcare information for family members from a single account while maintaining appropriate separation and consent.This is especially useful for:ChildrenElderly parentsDependentsFamily members who need assistance managing healthcare# 3.2 Family Dashboard-----------------------------------

Family Health

-----------------------------------

Jay

Health Status

-----------------------------------

Mother

2 Upcoming Appointments

-----------------------------------

Father

1 Prescription

-----------------------------------

Child

Medicine Reminder

-----------------------------------

[+ Add Family Member]
# 3.3 Add Family MemberFields:NameDate of BirthGenderRelationshipPhone NumberEmailProfile PhotoEmergency Information# 3.4 Relationship TypesExamples:FatherMotherSonDaughterSpouseGrandparentSiblingOther Dependent# 3.5 Family Member ProfileDisplays:Family Member

Profile

Appointments
Prescriptions
Medical Reports
Medicines
Health Timeline
Emergency Information
# 3.6 Family Health PermissionsThe account owner should control what they can access.Permission levels:View Only

View + Manage Appointments

View + Manage Health Records

Full Management
For adults, access should generally be consent-based.# 3.7 Family Appointment ManagementUsers can:Book appointmentsView upcoming appointmentsRescheduleCancelJoin video consultation where authorized# 3.8 Family Medical WalletEach family member should have a separate health record.Family

├── Jay
│   └── Medical Wallet
│
├── Mother
│   └── Medical Wallet
│
└── Father
    └── Medical Wallet
Records must not accidentally mix between family members.# 3.9 Family Medicine RemindersCaregivers can receive reminders for dependents where authorized.Example:Medicine Reminder

Mother's medicine is due.

[Mark Taken]

[Snooze]
# 3.10 Family Health TimelineEach family member has an independent timeline:2026

Doctor Consultation
      ↓
Lab Report
      ↓
Prescription
      ↓
Medicine
      ↓
Follow-up
# 4. Patient Profile# 4.1 Profile Screen-----------------------------------

Profile

[Profile Photo]

Jay Penshanwar

Patient ID

-----------------------------------

Personal Information

Medical Information

Emergency Information

Family

Preferences

Security

-----------------------------------
# 4.2 Personal InformationFields:Full NameProfile PhotoDate of BirthGenderMobile NumberEmailAddressPreferred Language# 4.3 Medical ProfileOptional information:Blood GroupAllergiesExisting ConditionsCurrent MedicationsPrevious SurgeriesImportant Medical NotesMedical information should be clearly separated from ordinary profile information.# 4.4 Emergency ProfileContains:Blood GroupAllergiesEmergency ContactsImportant Medical Information# 4.5 Profile CompletionDisplay:Profile Completion

80%

Complete your profile

[Complete Profile]
Do not require unnecessary health information merely to use basic platform functionality.# 5. Settings# 5.1 Settings DashboardSettings

Account
Privacy &amp; Security
Notifications
Language
Accessibility
Family
Emergency
Connected Services
Help &amp; Support
About
Legal
Logout
# 5.2 Account SettingsOptions:Edit ProfileChange Mobile NumberChange EmailChange PasswordManage FamilyDelete Account# 5.3 Privacy &amp; SecurityOptions:PasswordTwo-Factor AuthenticationBiometric Lock — futureActive SessionsConnected DevicesData SharingConsent ManagementDownload My DataDelete Account# 5.4 Session ManagementDisplay:Active Sessions

Windows PC
Current Session

Android Phone
Last active 10 min ago

[Log Out Other Devices]
# 5.5 Consent ManagementUsers should be able to review and manage consent for:Medical record sharingDoctor accessAI processingLocation accessNotificationsFamily accessEmergency information# 5.6 Language SettingsMedConnect AI is intended for multilingual healthcare access.Initial languages:EnglishHindiMarathiFuture:BengaliGujaratiTamilTeluguKannadaMalayalamPunjabiOdiaAssameseLanguage selection:App Language

○ English

○ हिंदी

○ मराठी

[Save]
The selected language should affect supported UI content while preserving medical accuracy.# 5.7 Accessibility SettingsOptions:Font SizeHigh ContrastReduced MotionScreen Reader SupportLarger ButtonsVoice Assistance — future# 5.8 Notification SettingsUsers can control:Appointments       ON
Medicine Reminders ON
Lab Reports        ON
AI Recommendations ON
Health Education   ON
Emergency Alerts   ON
Promotions         OFF
Emergency notifications should be treated separately from optional promotional notifications.# 5.9 Connected ServicesFuture integrations:Google CalendarApple CalendarHealth platformsPharmacy servicesLaboratory servicesPayment servicesUsers should be able to disconnect integrations.# 6. Help &amp; Support# 6.1 Help CenterCategories:AccountAppointmentsVideo ConsultationMedical WalletPrescriptionLaboratoryPharmacyEmergencyPaymentsTechnical Issues# 6.2 Search HelpHow can we help?

[Search Help Articles]
# 6.3 Contact SupportMethods:In-app supportEmailSupport ticketFAQFuture:AI Support Assistant# 6.4 Report a ProblemFields:Issue CategoryDescriptionScreenshotDevice InformationCTA:Submit Report# 7. FeedbackUsers can submit:App feedbackDoctor feedbackVideo consultation feedbackFeature requestsBug reportsExample:How was your experience?

★★★★★

Tell us more...

[Submit]
# 8. About MedConnect AIDisplays:MedConnect AI logoTaglineMissionVersionCompany informationContactWebsiteSocial links where applicableBrand tagline:Smart Care. Connected Everywhere.Mission:आरोग्यं सर्वत्र • सेवा सर्वदा# 9. Legal &amp; Compliance ScreensInclude:Terms of ServicePrivacy PolicyMedical DisclaimerConsent PolicyData Processing InformationThird-Party ServicesCookie Policy where applicableThe medical disclaimer should clearly state that AI-generated information is not a replacement for professional medical diagnosis or treatment.# 10. LogoutConfirmation:Logout?

Are you sure you want to logout?

[Cancel]

[Logout]
# 11. Account DeletionUse a multi-step confirmation.Delete Account

Deleting your account may remove or disable access
to your data according to applicable retention
requirements.

[Continue]
Require explicit confirmation.# 12. Global SearchA universal search should eventually allow users to search across:DoctorsAppointmentsPrescriptionsReportsMedicinesHealth ArticlesLaboratoriesPharmaciesExample:Search

"Diabetes"

Results

Doctors
Reports
Prescriptions
Articles
Laboratories
# 13. Global Empty StatesEvery module should have a meaningful empty state.Examples:### No AppointmentsNo upcoming appointments.

[Book a Doctor]
### No ReportsYour medical reports will appear here.

[Upload Report]


          
            
          
        
  
        
    

No PrescriptionsNo prescriptions yet.

Your prescriptions will appear here after
a doctor issues them.
### No Family MembersManage healthcare for your family.

[Add Family Member]
# 14. Global Error StatesCommon errors:Network unavailableServer unavailableUnauthorized accessSession expiredFile upload failedAI service unavailableVideo connection failedBooking unavailableExample:Something went wrong.

We couldn't complete your request.

[Try Again]
Avoid exposing technical error messages to patients.# 15. Session ExpirationYour session has expired.

Please login again to continue.

[Login]
Unsaved drafts should be protected where technically possible.# 16. Offline / Poor Connectivity ExperienceBecause MedConnect AI targets Tier-2, Tier-3, and rural users, the application should consider unreliable network conditions.Where technically possible:Cache basic UIPreserve draftsRetry uploadsShow connection statusCompress imagesProvide clear upload progressAllow retry after connection recoveryCritical healthcare actions should clearly indicate when the network connection is required.# 17. Global NavigationRecommended patient navigation:------------------------------------------------
Home
Doctors
Health
Appointments
Profile
------------------------------------------------
A prominent emergency entry point should remain accessible without dominating normal navigation.# 18. Patient Application Information ArchitecturePATIENT APP

├── Home
│   ├── Health Overview
│   ├── Quick Actions
│   ├── Upcoming Appointment
│   ├── Medicine Reminder
│   ├── Recent Reports
│   └── AI Recommendations
│
├── Doctors
│   ├── Search
│   ├── Specialists
│   ├── Doctor Profile
│   └── Appointment Booking
│
├── Appointments
│   ├── Upcoming
│   ├── Completed
│   ├── Cancelled
│   └── Consultation
│
├── Health
│   ├── Medical Wallet
│   ├── Reports
│   ├── Prescriptions
│   ├── Health Timeline
│   ├── Medicine
│   └── Family Health
│
├── Services
│   ├── Laboratories
│   ├── Pharmacy
│   ├── Health Education
│   └── Emergency
│
└── Profile
    ├── Personal Information
    ├── Medical Profile
    ├── Emergency Information
    ├── Settings
    ├── Privacy
    ├── Notifications
    ├── Language
    ├── Help
    └── About
# 19. Complete Patient Application Screen MatrixThis is the master screen inventory that should be used by Claude Design when generating the complete patient application.## A. AuthenticationIDScreenPriorityP-001Splash ScreenMVPP-002Welcome ScreenMVPP-003LoginMVPP-004RegisterMVPP-005Mobile OTPMVPP-006Email VerificationMVPP-007Forgot PasswordMVPP-008Reset PasswordMVPP-009Profile SetupMVPP-010Language SelectionMVPP-011Permission SetupMVP# B. Home &amp; DashboardIDScreenPriorityP-012Patient DashboardMVPP-013Health OverviewMVPP-014Quick ActionsMVPP-015Upcoming AppointmentMVPP-016Recent ReportsMVPP-017Medicine ReminderMVPP-018AI RecommendationsMVPP-019Global SearchPhase 2# C. AI HealthIDScreenPriorityP-020AI Health AssistantMVPP-021Chat InterfaceMVPP-022Suggested QuestionsMVPP-023Symptom CheckerMVPP-024Symptom InputMVPP-025Symptom ResultsMVPP-026Health RecommendationsMVPP-027AI DisclaimerMVP# D. DoctorsIDScreenPriorityP-028Doctor SearchMVPP-029Specialty SelectionMVPP-030Search ResultsMVPP-031Doctor FiltersMVPP-032Doctor ProfileMVPP-033Doctor ReviewsMVPP-034Doctor AvailabilityMVP# E. AppointmentsIDScreenPriorityP-035Appointment BookingMVPP-036Date SelectionMVPP-037Time SelectionMVPP-038Consultation TypeMVPP-039Report AttachmentMVPP-040Booking ConfirmationMVPP-041Appointment DetailsMVPP-042RescheduleMVPP-043CancellationMVPP-044Appointment HistoryMVP# F. Video ConsultationIDScreenPriorityP-045Join ConsultationMVPP-046Device PermissionMVPP-047Waiting RoomMVPP-048Video ConsultationMVPP-049In-call ChatMVPP-050Report SharingMVPP-051Connection ErrorMVPP-052Consultation CompleteMVPP-053Consultation FeedbackMVP# G. Medical WalletIDScreenPriorityP-054Medical Wallet DashboardMVPP-055Report ListMVPP-056Report DetailsMVPP-057Upload ReportMVPP-058OCR ProcessingMVPP-059OCR VerificationMVPP-060AI Report AnalysisMVPP-061Report TrendsPhase 2P-062Prescription ListMVPP-063Prescription DetailsMVPP-064Health TimelineMVPP-065Timeline DetailsMVPP-066Secure SharingMVP# H. LaboratoryIDScreenPriorityP-067Laboratory DashboardMVPP-068Test SearchMVPP-069Laboratory ResultsMVPP-070Test ComparisonMVPP-071Laboratory DetailsMVPP-072Test BookingPhase 2P-073Home CollectionPhase 2P-074Lab Booking ConfirmationPhase 2# I. PharmacyIDScreenPriorityP-075Pharmacy FinderMVPP-076Medicine SearchPhase 2P-077Pharmacy ResultsMVPP-078Pharmacy DetailsMVPP-079Pharmacy MapMVPP-080DirectionsMVP# J. Health EducationIDScreenPriorityP-081Health Education DashboardMVPP-082Health CategoriesMVPP-083Article ListMVPP-084Article DetailsMVPP-085Saved ArticlesPhase 2P-086Educational VideosPhase 3# K. MedicineIDScreenPriorityP-087Medicine DashboardMVPP-088Add MedicineMVPP-089Medicine DetailsMVPP-090Reminder SetupMVPP-091Dose ReminderMVPP-092Medicine HistoryMVPP-093Adherence DashboardPhase 2# L. NotificationsIDScreenPriorityP-094Notification CenterMVPP-095Notification DetailsMVPP-096Notification SettingsMVPP-097Appointment NotificationMVPP-098Medicine NotificationMVPP-099Lab NotificationMVPP-100AI Recommendation NotificationMVP# M. EmergencyIDScreenPriorityP-101Emergency SOSMVPP-102SOS ConfirmationMVPP-103Active SOSMVPP-104Emergency ContactsMVPP-105Add Emergency ContactMVPP-106Nearby HospitalsMVPP-107Emergency InformationMVPP-108Emergency QR CardPhase 2# N. Family HealthIDScreenPriorityP-109Family DashboardMVPP-110Add Family MemberMVPP-111Family Member ProfileMVPP-112Family AppointmentsMVPP-113Family Medical WalletMVPP-114Family TimelineMVPP-115Family PermissionsMVPP-116Family Medicine RemindersPhase 2# O. ProfileIDScreenPriorityP-117ProfileMVPP-118Edit ProfileMVPP-119Medical ProfileMVPP-120Emergency ProfileMVPP-121Profile CompletionMVP# P. SettingsIDScreenPriorityP-122SettingsMVPP-123Account SettingsMVPP-124Privacy &amp; SecurityMVPP-125Password SettingsMVPP-126Active SessionsPhase 2P-127Consent ManagementMVPP-128Language SettingsMVPP-129Accessibility SettingsMVPP-130Notification SettingsMVPP-131Connected ServicesPhase 2# Q. Support &amp; LegalIDScreenPriorityP-132Help CenterMVPP-133FAQMVPP-134Contact SupportMVPP-135Report ProblemMVPP-136FeedbackMVPP-137About MedConnect AIMVPP-138Terms of ServiceMVPP-139Privacy PolicyMVPP-140Medical DisclaimerMVPP-141Consent InformationMVP# R. AccountIDScreenPriorityP-142Logout ConfirmationMVPP-143Delete AccountMVPP-144Data Download RequestPhase 2P-145Account DeactivationPhase 2# 20. Global Component LibraryClaude Design should create reusable components rather than designing every screen independently.## NavigationBottom NavigationTop NavigationSidebarBack ButtonBreadcrumbs## Healthcare ComponentsDoctor CardAppointment CardMedicine CardReport CardPrescription CardLaboratory CardPharmacy CardHealth Article CardTimeline EventAI Recommendation Card## Input ComponentsSearchDate PickerTime PickerDropdownMulti-selectFile UploadOTP InputMedical Input## Status ComponentsSuccessWarningErrorCriticalPendingCompletedCancelled# 21. Global Design SystemThe complete patient application should maintain one consistent design system.## Brand PersonalityTrustworthyHumanIntelligentAccessibleCalmModernHealthcare-focused## Visual DirectionUse:Clean layoutsWhite/light backgroundsBlue and teal healthcare accentsSoft gradients where appropriateRounded cardsSubtle shadowsStrong typography hierarchyClear iconsLarge touch targetsAvoid:Excessive decorationOverly futuristic interfacesDense medical jargonExcessive animationsConfusing dashboards# 22. Responsive DesignThe patient application should be designed mobile-first.Breakpoints should support:Mobile
Tablet
Desktop
Large Desktop
Important screens should gracefully adapt rather than simply shrink.# 23. Animation GuidelinesAnimations should communicate system state.Use animation for:AI processingUpload progressBooking confirmationSOS activationVideo connectionSuccess statesAvoid unnecessary animation during:Medical readingPrescription viewingReport analysisEmergency workflows# 24. Trust &amp; Safety UXMedical information should always communicate the source.For example:Doctor Provided
AI Generated
User Added
System Generated
AI-generated information should never visually appear to be a doctor's diagnosis.# 25. Final Patient Application Architecture                         MEDCONNECT AI
                              │
                    PATIENT APPLICATION
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
      HEALTH                CARE                SERVICES
        │                     │                     │
   Medical Wallet         Doctors              Laboratory
   OCR                    Appointments         Pharmacy
   AI Reports             Video Call           Education
   Timeline               Prescription         Medicine
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                            AI LAYER
                              │
                 ┌────────────┼────────────┐
                 │            │            │
              Assistant   Symptom AI   Recommendations
                              │
                              │
                     EMERGENCY + FAMILY
                              │
                     ┌────────┴────────┐
                     │                 │
                    SOS           Family Health
                     │
                     │
                   PROFILE
                     │
            ┌────────┼─────────┐
            │        │         │
         Settings Privacy   Support
# 26. Complete Patient ExperienceThe complete patient experience should follow:DISCOVER
   ↓
REGISTER
   ↓
BUILD PROFILE
   ↓
ASK AI
   ↓
CHECK SYMPTOMS
   ↓
FIND DOCTOR
   ↓
BOOK APPOINTMENT
   ↓
VIDEO CONSULTATION
   ↓
RECEIVE E-PRESCRIPTION
   ↓
SAVE TO MEDICAL WALLET
   ↓
BOOK LAB TEST
   ↓
UPLOAD REPORT
   ↓
OCR
   ↓
AI REPORT ANALYSIS
   ↓
HEALTH TIMELINE
   ↓
MEDICINE REMINDER
   ↓
HEALTH EDUCATION
   ↓
FOLLOW-UP
   ↓
LONG-TERM HEALTH MANAGEMENT
# 27. Claude Design Generation InstructionsClaude Design should use this document as the master specification for the MedConnect AI Patient Application.The design should not create isolated screens. All screens must belong to one consistent healthcare ecosystem.The design should prioritize:Rural and Tier-2/Tier-3 usabilityMobile-first experienceLow cognitive loadMultilingual readinessAccessible healthcare terminologyFast workflowsClear AI vs Doctor distinctionSecure medical information handlingEmergency accessibilityConsistent navigationThe final design should feel like:A trusted digital healthcare companion — not merely a telemedicine application.# 28. Part 6 SummaryThis section completes the remaining Patient Application requirements.### Emergency SOSEmergency activationEmergency contactsLocation assistanceNearby hospitalsEmergency information

          
            
          
        
  
        
    

Family HealthFamily profilesFamily appointmentsFamily medical recordsFamily permissionsFamily medicine management### ProfilePersonal informationMedical informationEmergency informationProfile completion### SettingsPrivacySecurityConsentNotificationsLanguageAccessibilityConnected services

          
            
          
        
  
        
    

SupportHelp CenterFAQSupportFeedbackLegal information### Complete Screen MatrixThe complete patient application contains 145 identified screens/states, categorized across:AuthenticationDashboardAIDoctorsAppointmentsVideo ConsultationMedical WalletLaboratoryPharmacyHealth EducationMedicineNotificationsEmergencyFamily HealthProfileSettingsSupportLegalAccountThis screen matrix should be treated as the master checklist for UX/UI design, frontend implementation, QA, and future MedConnect AI integration.