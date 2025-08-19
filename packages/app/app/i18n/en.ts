import demoEn from "./demo-en"

const en = {
  errorCode: {
    0: "We couldn't save your info. Please try again.", // CANT_STORE_DATA
    1: "Hmm… something you entered doesn’t look right.", // UNEXPECTED_PROPERTY
    2: "Something went wrong on our side.", // UNKNOWN_ERROR
    3: "That took too long. Let’s give it another try.", // REQUEST_TIMEOUT_ERROR

    1000: "Please double‑check your email address.", // EMAIL_INVALID_ERROR
    1001: "That name doesn’t seem right.", // NAME_INVALID_ERROR
    1002: "Your password needs a quick update.", // PASSWORD_INVALID_ERROR
    1003: "This language or region isn’t supported yet.", // LOCALE_INVALID_ERROR

    2000: "Your sign‑in details don’t match.", // CREDENTIALS_ERROR
    2001: "Sign in to keep going.", // AUTH_ERROR

    3000: "We hit a snag during sign‑up.", // SIGNUP_CATCH_ERROR
    3001: "We couldn’t finish setting up your account.", // SIGNUP_CREATE_INITIAL_DATA_ERROR
    3002: "Looks like you already have an account with us.", // SIGNUP_USER_ALREADY_EXISTS_ERROR
    3004: "We couldn’t create your profile.", // SIGNUP_PROFILE_NOT_CREATED_ERROR

    3100: "That code doesn’t look correct.", // EMAIL_VERIFICATION_CODE_INVALID_ERROR
    3101: "We’ve already sent you a verification email.", // EMAIL_VERIFICATION_ALREADY_SENT_ERROR
    3102: "Your email is already confirmed.", // EMAIL_VERIFICATION_ALREADY_DONE_ERROR
    3103: "We couldn’t send the verification email.", // EMAIL_CANNOT_SEND_ERROR
    3104: "That verification code has expired.", // EMAIL_VERIFICATION_CODE_EXPIRED_ERROR
    3105: "Email verification didn’t work.", // EMAIL_VERIFICATION_FAILED_ERROR

    4000: "We couldn’t start your session.", // SESSION_CREATE_ERROR
    4001: "We couldn’t log you out properly.", // SESSION_DESTROY_ERROR
    4002: "Your profile isn’t loading right now.", // PROFILE_ERROR
    4003: "We couldn’t load your overview.", // OVERVIEW_ERROR

    5000: "Sign‑up didn’t go through completely.", // TRANSACTION_ERROR
    5001: "We can’t find that account.", // ACCOUNT_ID_ERROR
    5002: "We can’t find that income record.", // INCOME_ID_ERROR
    5003: "We can’t find that category.", // CATEGORY_ID_ERROR
    5004: "We can’t find that currency.", // CURRENCY_ID_ERROR
    5005: "We don’t recognize that transaction type.", // TRANSACTION_TYPE_ID_ERROR
    5006: "The amount doesn’t look right.", // TRANSACTION_AMOUNT_ERROR
    5007: "This description doesn’t look valid.", // TRANSACTION_DESCRIPTION_ERROR
    5008: "That date doesn’t seem right.", // TRANSACTION_CREATE_DATE_ERROR
    5009: "We can’t find the destination account.", // TARGET_ACCOUNT_ID_ERROR
    5010: "We couldn’t access that account.", // ACCOUNT_ERROR
    5011: "That account name isn’t valid.", // ACCOUNT_NAME_ERROR
    5012: "This account can’t be used right now.", // ACCOUNT_STATUS_ERROR
    5013: "This income can’t be used right now.", // INCOME_STATUS_ERROR
    5014: "We couldn’t process that income.", // INCOME_ERROR
    5015: "That income name isn’t valid.", // INCOME_NAME_ERROR
    5016: "We couldn’t process that category.", // CATEGORY_ERROR
    5017: "That category name isn’t valid.", // CATEGORY_NAME_ERROR
    5018: "We couldn’t process that currency.", // CURRENCY_ERROR
    5019: "We can’t find that user.", // USER_ID_ERROR
    5020: "This user can’t be used right now.", // USER_STATUS_ERROR
  },
  validation: {
    required: "Field cannot be empty",
    minLength: "Must be at least {{num}} characters",
    email: "Invalid email format",
    name: "Invalid name format must contain only numbers or alphabet characters.",
    passwordUppercase: "Password must contain at least one uppercase letter",
    passwordLowercase: "Password must contain at least one lowercase letter",
    passwordNumber: "Password must contain at least one number",
    passwordSpecial: "Password must contain at least one special character (e.g., !@#$%)",
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
    ok: "OK!",
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
