import { ComponentType, FC, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { IUserClient } from "tenpercent/shared/src/interfaces/IUserClient"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import AlertService from "@/services/AlertService"
import { api } from "@/services/api"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { validateEmail, validatePassword } from "@/utils/validation"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = (_props) => {
  const authPasswordInput = useRef<TextInput>(null)
  const { navigation } = _props
  const [authPassword, setAuthPassword] = useState<string>("")
  const [authEmail, setAuthEmail] = useState<string>("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState<boolean>(true)
  const [attemptsCount, setAttemptsCount] = useState<number>(0)
  const [emailError, setEmailError] = useState<TxKeyPath | undefined>()
  const [passwordError, setPasswordError] = useState<TxKeyPath | undefined>()
  const { setAuth, isPasswordSaveCheckbox, setIsPasswordSaveCheckbox } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  function signUp() {
    navigation.navigate({ name: "SignUp", params: undefined })
  }

  async function login() {
    const emailErr = validateEmail(authEmail)
    const passwordErr = validatePassword(authPassword)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (emailErr || passwordErr) {
      return
    }
    setAttemptsCount(attemptsCount + 1)
    if (!authEmail) {
      AlertService.error(translate("validation:email"), translate("common:error"))
      return
    }
    if (!authPassword) {
      AlertService.error(translate("validation:passwordRequirements"), translate("common:error"))
      return
    }
    if (emailError) return
    if (passwordError) return

    const response = await api.doLogin({
      password: authPassword as string,
      email: authEmail as string,
    })

    if (response.kind === GeneralApiProblemKind.Ok) {
      if (!response.token) {
        AlertService.error(translate("errorCode:UNKNOWN_ERROR"), translate("common:error"))
        return
      }
      const { email, userId, status } = response.data as IUserClient
      await setAuth({
        email,
        status,
        userId,
        token: response.token,
      })
      setAuthPassword("")
    } else {
      switch (response.kind) {
        case GeneralApiProblemKind.BadData: {
          AlertService.error(translate("errorCode:CREDENTIALS_ERROR"), translate("common:error"))
          break
        }
        default: {
          AlertService.error(translate("errorCode:UNKNOWN_ERROR"), translate("common:error"))
        }
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
      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
      <Text tx="loginScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
      {attemptsCount > 2 && (
        <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
      )}

      <TextField
        value={authEmail}
        onChangeText={(email) => {
          if (emailError) {
            setEmailError(validateEmail(email))
          }
          setAuthEmail(email)
        }}
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
        onChangeText={(password) => {
          if (passwordError) {
            setPasswordError(validatePassword(password))
          }
          setAuthPassword(password)
        }}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="common:passwordFieldLabel"
        placeholderTx="common:passwordFieldPlaceholder"
        onSubmitEditing={login}
        helperTx={passwordError}
        status={passwordError ? "error" : undefined}
        RightAccessory={PasswordRightAccessory}
      />

      <Checkbox
        labelTx="loginScreen:rememberMe"
        helperTx="loginScreen:rememberMeHelper"
        value={isPasswordSaveCheckbox}
        onPress={() => setIsPasswordSaveCheckbox(!isPasswordSaveCheckbox)}
      />

      <Button
        testID="login-button"
        tx="loginScreen:tapToLogIn"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
      />
      <Button
        testID="signUp-button"
        tx="common:signUp"
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

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
