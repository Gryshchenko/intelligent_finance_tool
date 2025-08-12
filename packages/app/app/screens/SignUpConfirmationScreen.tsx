import { FC, useEffect, useMemo, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { api } from "@/services/api"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

interface SignUpConfirmationScreenProps extends AppStackScreenProps<"SignUpConfirmation"> {}

export const SignUpConfirmationScreen: FC<SignUpConfirmationScreenProps> = (_props) => {
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  // const [attemptsCount, setAttemptsCount] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [remainingAttempts, setRemainingAttempts] = useState(10)

  const { themed } = useAppTheme()
  const { logout } = useAuth()

  const validationCodeError = useMemo(() => {
    if (!confirmationCode) return "signUpConfirmation.validation.required"
    if (!/^[0-9]{8}$/.test(confirmationCode)) return "signUpConfirmation.validation.exactLength"
    return ""
  }, [confirmationCode]) as TxKeyPath

  const errorMessage = isSubmitted ? translate(validationCodeError) : ""

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isResendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    } else if (resendTimer === 0) {
      setIsResendDisabled(false)
      setResendTimer(60)
    }
    return () => clearTimeout(timer)
  }, [isResendDisabled, resendTimer])

  async function signUp() {
    setIsSubmitted(true)
    if (errorMessage) return

    const response = await api.doSignUpConfirmation({
      confirmationCode,
    })

    if (response.kind === "ok") {
      setIsSubmitted(false)
    } else {
      console.error(`Error confirming email: ${JSON.stringify(response)}`)
      alert(translate("signUpConfirmation:confirmError"))
    }
  }

  async function resendCode() {
    if (remainingAttempts <= 0) {
      alert(translate("signUpConfirmation:limitReached" as TxKeyPath))
      return
    }

    try {
      const response = await api.doSignUpConfirmation({ confirmationCode })
      if (response.kind === "ok") {
        alert(translate("signUpConfirmation.codeSent" as TxKeyPath))
        setIsResendDisabled(true)
        setRemainingAttempts((prev) => prev - 1)
      } else {
        alert(translate("signUpConfirmation.sendError" as TxKeyPath))
      }
    } catch (error) {
      console.error(error)
      alert(translate("signUpConfirmation.sendError" as TxKeyPath))
    }
  }
  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text
        testID="signUp-heading"
        tx="signUpConfirmation:title"
        preset="heading"
        style={themed($logIn)}
      />
      <Text tx="signUpConfirmation:description" preset="subheading" style={themed($enterDetails)} />

      <TextField
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        labelTx="common:confirmationCodeFieldLabel"
        placeholderTx="common:confirmationCodeFieldPlaceholder"
        helper={errorMessage}
        status={errorMessage ? "error" : undefined}
        maxLength={8}
      />

      <Button
        testID="signUp-button"
        tx="signUpConfirmation:confirmButton"
        style={themed($tapButton)}
        preset="reversed"
        onPress={signUp}
      />

      <Button
        tx={isResendDisabled ? "signUpConfirmation:resendInfo" : "signUpConfirmation:resendButton"}
        txOptions={isResendDisabled ? { seconds: resendTimer } : undefined}
        style={themed($tapButton)}
        preset="default"
        onPress={resendCode}
        disabled={isResendDisabled}
      />

      <Text
        tx="signUpConfirmation:remainingAttempts"
        txOptions={{ remaining: remainingAttempts }}
        style={themed($tapButton)}
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
