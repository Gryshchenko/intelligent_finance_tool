import demoEn from "./demo-en"

const en = {
  errorCode: {
    CANT_STORE_DATA: "We couldn't save your info. Please try again.",
    UNEXPECTED_PROPERTY: "Hmm… something you entered doesn’t look right.",
    UNKNOWN_ERROR: "Something went wrong on our side.",
    REQUEST_TIMEOUT_ERROR: "That took too long. Let’s give it another try.",

    EMAIL_INVALID_ERROR: "Please double-check your email address.",
    NAME_INVALID_ERROR: "That name doesn’t seem right.",
    PASSWORD_INVALID_ERROR: "Your password needs a quick update.",
    LOCALE_INVALID_ERROR: "This language or region isn’t supported yet.",

    CREDENTIALS_ERROR: "Your sign-in details don’t match.",
    AUTH_ERROR: "Sign in to keep going.",

    SIGNUP_CATCH_ERROR: "We hit a snag during sign-up.",
    SIGNUP_CREATE_INITIAL_DATA_ERROR: "We couldn’t finish setting up your account.",
    SIGNUP_USER_ALREADY_EXISTS_ERROR: "Looks like you already have an account with us.",
    SIGNUP_PROFILE_NOT_CREATED_ERROR: "We couldn’t create your profile.",

    EMAIL_VERIFICATION_CODE_STILL_ACTIVE_ERROR: "You already have an active verification code.",
    EMAIL_VERIFICATION_ALREADY_DONE_ERROR: "Your email is already confirmed.",
    EMAIL_CANNOT_SEND_ERROR: "We couldn’t send the verification email.",
    EMAIL_VERIFICATION_CODE_EXPIRED_ERROR: "That verification code has expired.",
    EMAIL_VERIFICATION_FAILED_ERROR: "Email verification didn’t work.",

    SESSION_CREATE_ERROR: "We couldn’t start your session.",
    SESSION_DESTROY_ERROR: "We couldn’t log you out properly.",
    PROFILE_ERROR: "Your profile isn’t loading right now.",
    OVERVIEW_ERROR: "We couldn’t load your overview.",

    TRANSACTION_ERROR: "Something went wrong with the transaction.",
    ACCOUNT_ERROR: "There was a problem accessing your account.",
    INCOME_ERROR: "We couldn’t process your income data.",
    CATEGORY_ERROR: "We couldn’t process your category data.",
    CURRENCY_ERROR: "We couldn’t process your currency data.",
    USER_ERROR: "We couldn’t process your user data.",
    EMAIL_CONFIRMATION_ERROR: "We couldn’t confirm your email.",
  },
  validation: {
    maxLength: "This field cannot be longer than 50 characters.",
    required: "Field cannot be empty",
    email: "Invalid email format",
    name: "Invalid name format must contain only numbers or alphabet characters.",
    passwordMinLength: "Must be at least 5 characters",
    passwordUppercase: "Password must contain at least one uppercase letter",
    passwordLowercase: "Password must contain at least one lowercase letter",
    passwordNumber: "Password must contain at least one number",
    passwordSpecial: "Password must contain at least one special character (e.g., !@#$%)",
    passwordRequirements:
      "Your password must include an uppercase letter, a lowercase letter, a number, and a special character (e.g., !@#$%).",
  },
  signUpConfirmation: {
    title: "Confirm your email",
    description: "We have sent an 8-digit confirmation code to your email address.",
    enterCode: "Please enter the 8-digit code below to confirm your email.",
    resendInfo: "You can request a new code in {{seconds}} seconds.",
    resendLimit: "You can request up to 10 codes per day for this session.",
    remainingAttempts: "You have {{remaining}} attempts left today.",
    codeSent: "A new confirmation code has been sent to your email.",
    invalidCode: "Invalid confirmation code. Please check and try again.",
    expiredCode: "This code has expired. Please request a new one.",
    limitReached: "You have reached the daily limit of 10 codes for this email/session.",
    sendError: "We couldn't send the confirmation code. Please try again later.",
    confirmError: "Something went wrong while confirming your email. Please try again.",
    validation: {
      required: "Confirmation code cannot be empty",
      exactLength: "Code must contain exactly 8 digits",
      numbersOnly: "Only numbers are allowed",
    },
    confirmButton: "Confirm",
    resendButton: "Resend code",
    success: "Your email has been successfully confirmed.",
  },
  common: {
    error: "Error",
    info: "Info",
    warning: "Warning",
    ok: "OK",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    signUp: "Sign Up",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    publicNameFieldLabel: "Public name",
    publicNameFieldPlaceholder: "Enter your public name",
    confirmationCodeFieldLabel: "Confirmation code",
    confirmationCodeFieldPlaceholder: "Enter confirmation code",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    logIn: "Log In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    hint: "Hint: you can use any email address and your favorite password :)",
    tapToLogIn: "Tap to log in!",
    rememberMe: "Remember me",
    rememberMeHelper: "For your convenience, keep this box checked to stay signed in",
  },
  signUpScreen: {
    enterDetails: "",
    tapToLogIn: "Tap to Sign Up!",
    repeatPasswordFieldLabel: "Repeat your password",
    repeatPasswordFieldPlaceholder: "Confirm your password here",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },

  ...demoEn,
}

export default en
export type Translations = typeof en
