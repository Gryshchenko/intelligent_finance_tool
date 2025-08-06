import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { api } from "@/services/api"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { ValidationTypes } from "../../types/ValidationTypes"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const { authEmail, setAuthEmail, validationError, setAuthToken } = useAuth()

  const validationNameError = useMemo(() => {
    if (!/^[a-zA-Z0-9]{3,10}$/.test(name)) return ValidationTypes.NAME
    return ""
  }, [name]) as TxKeyPath
  const validationPasswordError = useMemo(() => {
    if (!authPassword || authPassword.length < 6) return ValidationTypes.MIN_LENGTH
    if (!/[A-Z]/.test(authPassword)) return ValidationTypes.PASSWORD_UPPERCASE
    if (!/[a-z]/.test(authPassword)) return ValidationTypes.PASSWORD_LOWERCASE
    if (!/[0-9]/.test(authPassword)) return ValidationTypes.PASSWORD_NUMBER
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(authPassword)) return ValidationTypes.PASSWORD_SPECIAL

    return ""
  }, [authPassword]) as TxKeyPath

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    // setAuthEmail("ignite@infinite.red")
    // setAuthPassword("ign1teIsAwes0m3")
  }, [setAuthEmail])

  const errorEmail = isSubmitted ? translate(validationError) : ""
  const errorPass = isSubmitted ? translate(validationPasswordError) : ""
  const errorName = isSubmitted ? translate(validationNameError) : ""

  async function signUp() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)
    if (validationError || validationPasswordError || validationPasswordError) return

    const response = await api.doSignUp({
      password: authPassword as string,
      email: authEmail as string,
      name: name as string,
      locale: "en_US",
    })
    if (response.kind === "ok") {
      // Make a request to your server to get an authentication token.
      // If successful, reset the fields and set the token.
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")

      // We'll mock this with a fake token.
      setAuthToken(String(Date.now()))
    } else {
      console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
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
        value={name}
        onChangeText={setName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        labelTx="common:nameFieldLabel"
        placeholderTx="common:nameFieldPlaceholder"
        helper={errorName}
        status={errorName ? "error" : undefined}
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
        helper={errorEmail}
        status={errorEmail ? "error" : undefined}
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
        helper={errorPass}
        status={errorPass ? "error" : undefined}
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
