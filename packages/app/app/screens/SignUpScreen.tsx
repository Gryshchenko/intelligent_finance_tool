import { ComponentType, FC, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { ErrorCode } from "tenpercent/shared"

import { Button } from "@/components/buttons/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import {
  validateEmail,
  validatePassword,
  validatePublicName,
  ValidationTypes,
} from "@/utils/validation"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = (_props) => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState<string>("")
  const [publicName, setPublicName] = useState<string>("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [authEmail, setAuthEmail] = useState<string>("")
  const [publicNameError, setPublicNameError] = useState<TxKeyPath | undefined>()
  const [emailError, setEmailError] = useState<TxKeyPath | undefined>()
  const [passwordError, setPasswordError] = useState<TxKeyPath | undefined>()
  const { doSignUp } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  async function signUp() {
    const emailErr = validateEmail(authEmail)
    const passwordErr = validatePassword(authPassword)
    const publicNameError = validatePublicName(publicName)

    setPublicNameError(publicNameError)
    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (emailErr || passwordErr || publicNameError) {
      return
    }

    setAttemptsCount(attemptsCount + 1)
    const response = await doSignUp({
      password: authPassword as string,
      email: authEmail as string,
      publicName: publicName as string,
      locale: "US-en",
    })
    switch (response.kind) {
      case GeneralApiProblemKind.Ok: {
        setPublicName("")
        setAuthEmail("")
        setAuthPassword("")
        break
      }
      case GeneralApiProblemKind.BadData: {
        const errors = response.errors ?? []
        for (const error of errors) {
          const payload = error?.payload
          const errorCode = error?.errorCode
          if (errorCode === ErrorCode.SIGNUP_USER_ALREADY_EXISTS_ERROR) {
            setEmailError(ValidationTypes.EMAIL_UNIQUE)
          } else if (payload?.field === "email") {
            setEmailError(ValidationTypes.REQUIRED)
          }
          if (payload?.field === "password") {
            setPasswordError(ValidationTypes.REQUIRED)
          }
          if (payload?.field === "locale") {
          }
          if (payload?.field === "publicName") {
            setPublicNameError(ValidationTypes.REQUIRED)
          }
        }
        break
      }
      case GeneralApiProblemKind.Unknown: {
        break
      }
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="signUp-heading" tx="common:signUp" preset="heading" style={themed($logIn)} />
      <Text tx="signUpScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />

      <TextField
        value={publicName}
        onChangeText={setPublicName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        labelTx="common:publicNameFieldLabel"
        placeholderTx="common:publicNameFieldPlaceholder"
        helperTx={publicNameError}
        status={publicNameError ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="common:emailFieldLabel"
        placeholderTx="common:emailFieldPlaceholder"
        helperTx={emailError}
        status={emailError ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        helperTx={passwordError}
        status={passwordError ? "error" : undefined}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="common:passwordFieldLabel"
        placeholderTx="common:passwordFieldPlaceholder"
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="signUp-button"
        tx="signUpScreen:tapToLogIn"
        style={themed($tapButton)}
        preset="reversed"
        onPress={signUp}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
