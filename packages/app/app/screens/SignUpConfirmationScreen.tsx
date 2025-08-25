import { FC, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import AlertService from "@/services/AlertService"
import { api } from "@/services/api"
import { GeneralApiProblemKind } from "@/services/api/apiProblem"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
import { validateCode } from "@/utils/validation"

interface SignUpConfirmationScreenProps extends AppStackScreenProps<"SignUpConfirmation"> {}

export const SignUpConfirmationScreen: FC<SignUpConfirmationScreenProps> = (_props) => {
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [validationCodeError, setValidationCodeError] = useState<TxKeyPath | undefined>()
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  // const [remainingAttempts, setRemainingAttempts] = useState(10)
  const { updateAuthToken, userId } = useAuth()

  const { themed } = useAppTheme()
  const { logout } = useAuth()

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

  async function verify() {
    if (!userId) {
      AlertService.error(translate("errorCode:UNKNOWN_ERROR"), translate("common:error"))
      return
    }
    const codeErr = validateCode(confirmationCode)

    setValidationCodeError(codeErr)
    if (codeErr) {
      return
    }

    const response = await api.doSignUpEmailVerify({
      userId,
      confirmationCode,
    })

    if (response.kind === GeneralApiProblemKind.Ok) {
      if (!response.token) {
        AlertService.error(translate("errorCode:UNKNOWN_ERROR"), translate("common:error"))
        return
      }
      await updateAuthToken(response.token)
    } else {
      console.error(`Error confirming email: ${JSON.stringify(response)}`)
      AlertService.error(translate("common:error"), translate("signUpConfirmation:confirmError"))
    }
  }

  async function resend() {
    // if (remainingAttempts <= 0) {
    //   AlertService.info(
    //     translate("common:info"),
    //     translate("signUpConfirmation:limitReached" as TxKeyPath),
    //   )
    //   return
    // }
    if (!userId) {
      AlertService.error(translate("errorCode:UNKNOWN_ERROR"), translate("common:error"))
      return
    }

    try {
      const response = await api.doSignUpEmailResend({ userId })
      if (response.kind === "ok") {
        AlertService.info(
          translate("common:info"),
          translate("signUpConfirmation.codeSent" as TxKeyPath),
        )
        setIsResendDisabled(true)
        // setRemainingAttempts((prev) => prev - 1)
      } else {
        AlertService.error(
          translate("common:error"),
          translate("signUpConfirmation.sendError" as TxKeyPath),
        )
      }
    } catch (error) {
      console.log(error)
      AlertService.error(
        translate("common:error"),
        translate("signUpConfirmation.sendError" as TxKeyPath),
      )
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
        onChangeText={(code) => {
          if (validationCodeError) {
            setValidationCodeError(validateCode(code))
          }
          setConfirmationCode(code)
        }}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        labelTx="common:confirmationCodeFieldLabel"
        placeholderTx="common:confirmationCodeFieldPlaceholder"
        helperTx={validationCodeError}
        status={validationCodeError ? "error" : undefined}
        maxLength={8}
      />

      <Button
        testID="signUp-button"
        tx="signUpConfirmation:confirmButton"
        style={themed($tapButton)}
        preset="reversed"
        onPress={verify}
      />

      <Button
        tx={isResendDisabled ? "signUpConfirmation:resendInfo" : "signUpConfirmation:resendButton"}
        txOptions={isResendDisabled ? { seconds: resendTimer } : undefined}
        style={themed($tapButton)}
        preset="default"
        onPress={resend}
        disabled={isResendDisabled}
      />

      {/*<Text*/}
      {/*  tx="signUpConfirmation:remainingAttempts"*/}
      {/*  txOptions={{ remaining: remainingAttempts }}*/}
      {/*  style={themed($tapButton)}*/}
      {/*/>*/}
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
