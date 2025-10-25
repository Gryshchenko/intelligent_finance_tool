import { TextStyle } from "react-native"

import { BackButton } from "@/components/BackButton"
import { ErrorState } from "@/components/ErrorState"
import { Header } from "@/components/Header"
import { PendingState } from "@/components/PengingState"
import { Screen } from "@/components/Screen"
import { $styles } from "@/theme/styles"

interface GenericListScreenProps<T, B> {
  name: string
  data: T
  fetch?: B
  isPending?: boolean
  isError?: boolean
  onBack?: () => void
  RenderComponent: React.ComponentType<{ data: T; fetch?: B }>
}

export function GenericListScreen<T, B>({
  name,
  data,
  fetch,
  isPending,
  isError,
  onBack,
  RenderComponent,
}: GenericListScreenProps<T, B>) {
  return (
    <Screen preset="fixed" contentContainerStyle={$styles.screen} safeAreaEdges={["top"]}>
      <Header
        title={name}
        titleMode="flex"
        titleStyle={$rightAlignTitle}
        safeAreaEdges={[]}
        LeftActionComponent={onBack ? <BackButton onPress={onBack} /> : undefined}
      />

      {isError && <ErrorState buttonOnPress={onBack} />}
      {isPending && <PendingState />}
      {!isError && !isPending && <RenderComponent data={data} fetch={fetch} />}
    </Screen>
  )
}

const $rightAlignTitle: TextStyle = {
  textAlign: "center",
}
