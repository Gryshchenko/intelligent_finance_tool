import { create } from "apisauce"

import { ApiAbstract, DEFAULT_API_CONFIG } from "@/services/api/apiAbstract"
import { getGeneralApiProblem } from "@/services/api/apiProblem"
import { AuthService } from "@/services/AuthService"

jest.mock("apisauce", () => ({
  create: jest.fn(),
}))
jest.mock("@/services/AuthService")
jest.mock("@/services/api/apiProblem")

const mockPost = jest.fn()
;(create as jest.Mock).mockReturnValue({
  post: mockPost,
  setHeader: jest.fn(),
})

// --- Subclass to expose refresh() ---
class Api extends ApiAbstract {
  public async testRefresh() {
    // @ts-expect-error testing private method
    return this.refresh()
  }
}

describe("ApiAbstract.refresh()", () => {
  let api: Api
  const userId = "123"
  const token = "old.token"

  beforeEach(() => {
    jest.clearAllMocks()
    ;(AuthService.instance as jest.Mock).mockReturnValue({
      userId,
      token,
    })
    api = new Api(DEFAULT_API_CONFIG)
  })

  it("returns false if userId is missing", async () => {
    ;(AuthService.instance as jest.Mock).mockReturnValue({
      userId: null,
      token,
    })

    const res = await api.testRefresh()

    expect(res).toBe(false)
  })

  it("returns false if request not ok and problem exists", async () => {
    mockPost.mockResolvedValueOnce({ ok: false, data: {} })
    ;(getGeneralApiProblem as jest.Mock).mockReturnValue({ kind: "unauthorized" })

    const res = await api.testRefresh()

    expect(res).toBe(false)
  })

  it("throws if new token is missing", async () => {
    mockPost.mockResolvedValueOnce({
      ok: true,
      data: { data: {} }, // no token inside
    })

    const res = await api.testRefresh()

    expect(res).toBe(false) // refresh failed
  })

  it("updates token and returns true when success", async () => {
    const newToken = "new.token"
    const mockAuth = {
      userId,
      set token(val: string) {
        // @ts-ignore
        this._token = val
      },
    }
    ;(AuthService.instance as jest.Mock).mockReturnValue(mockAuth)

    mockPost.mockResolvedValueOnce({
      ok: true,
      data: { data: { token: newToken } },
    })

    const res = await api.testRefresh()

    expect(res).toBe(true)
    expect(mockAuth.token).toBe(newToken)
  })

  it("returns false if exception thrown", async () => {
    mockPost.mockRejectedValueOnce(new Error("network fail"))

    const res = await api.testRefresh()

    expect(res).toBe(false)
  })
})
